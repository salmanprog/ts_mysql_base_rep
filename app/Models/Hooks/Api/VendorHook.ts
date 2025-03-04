import _ from 'lodash';
import FileUpload from 'App/Libraries/FileUpload/FileUpload'
import Vendor from 'App/Models/Vendor';
import Hash from '@ioc:Adonis/Core/Hash'
import { sendMail, currentDateTime } from 'App/Helpers/Index'
import Database from '@ioc:Adonis/Lucid/Database'
import Application  from '@ioc:Adonis/Core/Application'
import Encryption from '@ioc:Adonis/Core/Encryption'
import Env from '@ioc:Adonis/Core/Env'
import Subscription from 'App/Models/Subscription';
import UserDeviceToken from 'App/Models/UserDeviceToken';
import VendorInformation from 'App/Models/VendorInformation';
const moment = require('moment');

export default class VendorHook
{
    private static except_update_params: string[] = [
        'username',
        'slug',
        'email',
        'password',
        'status',
        'is_email_verify',
        'is_mobile_verify',
        'mobile_otp',
        'email_otp',
        'remember_token',
        'device_type',
        'device_token',
      ];

     /**
     * Hook for manipulate query of index result
     * @param {current mongo query} query
     * @param {adonis request object} request
     * @param {object} slug
     */
    public static async indexQueryHook(query: any, request: any, slug:string = '')
    {
        let params = request.all();
        query.select('users.*')
        if( typeof request.apiToken == 'function' && !_.isEmpty(slug) )
        {
          query.preload('userApiToken', (userApiTokenQuery) => {
            userApiTokenQuery.where('api_token', request.apiToken())
          })
        }
        if(!_.isEmpty(params.is_subscription)){
            query.where('is_subscription',params.is_subscription)
        }
        query.preload('VendorInformation').preload('Subscription').where('users.user_type','vendor');
    }

    /**
     * Hook for manipulate data input before add data is execute
     * @param {adonis request object} request
     * @param {payload object} params
     */
    public static async beforeCreateHook(request: any, params:any)
    {
        if( Env.get('OTP_DRIVER') == 'Telesign' && Env.get('OTP_SENDBOX') == 0 ){
            params.mobile_otp = request.otpCode();
            params.mobile_otp_created_at = currentDateTime();
        }
        let username      = await Vendor.generateSlug(params.name);
        let current_date = moment().format("YYYY-MM-DD")
        let subs_id = !_.isEmpty(params.subscripton_id) ? params.subscripton_id : "1";
        let get_subscription = await Subscription.query().where('id',subs_id).first();
        //params.user_group_id = 3;
        params.user_type  = 'vendor';
        params.password   = await Hash.make(params.password)
        params.username   = username
        params.slug       = username
        params.is_email_verify       = 1
        params.is_subscription = (subs_id == 1) ? '0' : '1'
        params.subscripton_id = get_subscription?.id
        params.subscription_title = get_subscription?.title
        params.subscription_amount = get_subscription?.amount
        params.subscription_start_date = current_date
        params.subscription_end_date = moment(moment().format(current_date,"YYYY-MM-DD")).add(get_subscription?.days, 'days').format("YYYY-MM-DD")
        params.created_at = currentDateTime();
    }

    /**
     * Hook for execute command after add public static function called
     * @param {saved record object} record
     * @param {adonis request object} request
     * @param {payload object} params
     */
    public static async afterCreateHook(record:any, request:any, params:any)
    {
        let request_params = request.all();
        //save user api token
        let api_token = User.generateApiToken(record);
        await Database.table('user_api_tokens').insert({
            user_id: record.id,
            api_token: api_token,
            device_type: request_params.device_type,
            ip_address: request.ip(),
            user_agent: request.header('User-Agent'),
            created_at: currentDateTime()
        })
        //save user device token
        if( !_.isEmpty(request_params.device_type) && !_.isEmpty(request_params.device_token) ){
          await Database.table('user_device_tokens').insert({
              user_id: record.id,
              device_type: request_params.device_type,
              device_token: request_params.device_token,
              created_at: currentDateTime()
          })
        }

        //merge api token
        const Request = Application.container.use('Adonis/Core/Request')
        Request.macro('apiToken', function () {
            return api_token;
        });
        //send welcome email to user
        if( Env.get('MAIL_SANDBOX') == 0 ){
            let email_params = {
              name: record.name,
              app_name: Env.get('APP_NAME'),
              link: Env.get('APP_URL') + '/user/verify/' + Encryption.encrypt(record.email)
            }
            sendMail('emails/register',record.email,`Welcome to ${email_params.app_name} `,email_params);
        }
    }

    /**
     * Hook for manipulate data input before update data is execute
     * @param {adonis request object} request
     * @param {payload object} params
     * @param {string} slug
     */
    public static async beforeEditHook(request:any, params:any, slug:string)
    {
        for (const key in params) {
            if (this.except_update_params.includes(key)) {
                delete params[key];
            }
        }

        if( !_.isEmpty(request.file('image_url')) ){
          params.image_url  = await FileUpload.doUpload(request.file('image_url'),'user');
          //params.blurimage  = await FileUpload.createBlurHash(params.image_url);
        }


        let vendor_services = request.all();
        console.log('vendor_services........................',vendor_services)
        let ser_one = await VendorInformation.query().where('user_id',request.user().id).where('identifier','service_parent_id').first();
        let ser_two = await VendorInformation.query().where('user_id',request.user().id).where('identifier','service_area').first();
        let ser_three = await VendorInformation.query().where('user_id',request.user().id).where('identifier','available_hours').first();
        let ser_four = await VendorInformation.query().where('user_id',request.user().id).where('identifier','available_day').first();
        let ser_five = await VendorInformation.query().where('user_id',request.user().id).where('identifier','per_hour_rate').first();
        let ser_six = await VendorInformation.query().where('user_id',request.user().id).where('identifier','experience_in_number').first();
        let ser_seven = await VendorInformation.query().where('user_id',request.user().id).where('identifier','experience_in_text').first();
        let ser_eight = await VendorInformation.query().where('user_id',request.user().id).where('identifier','emergency_hour').first();
        let ser_nine = await VendorInformation.query().where('user_id',request.user().id).where('identifier','description').first();
        let ser_ten = await VendorInformation.query().where('user_id',request.user().id).where('identifier','is_notification').first();
        let old_ser_one = !_.isEmpty(ser_one) ? ser_one.service_id : '';
        let old_ser_two = !_.isEmpty(ser_two) ? ser_two.txt_field : '';
        let old_ser_three = !_.isEmpty(ser_three) ? ser_three.service_id : '';
        let old_ser_four = !_.isEmpty(ser_four) ? ser_four.service_id : '';
        let old_ser_five = !_.isEmpty(ser_five) ? ser_five.txt_field : '';
        let old_ser_six = !_.isEmpty(ser_six) ? ser_six.txt_field : '';
        let old_ser_seven = !_.isEmpty(ser_seven) ? ser_seven.txt_field : '';
        let old_ser_eight = !_.isEmpty(ser_eight) ? ser_eight.service_id : '';
        let old_ser_nine = !_.isEmpty(ser_nine) ? ser_nine.txt_field : '';
        let old_ser_ten = !_.isEmpty(ser_ten) ? ser_ten.service_id : '';

        let vendor_service_arr = []
        let service_parent = {
            user_id:request.user().id,
            slug:request.user().id+'_service_parent_id',
            service_id:!_.isEmpty(vendor_services.services_id) ? vendor_services.services_id : old_ser_one,
            identifier:'service_parent_id',
            txt_field:null,
            created_at: currentDateTime()
        }
        vendor_service_arr.push(service_parent)
        if(!_.isEmpty(vendor_services.services_types_id)){
            
            let sub_services = JSON.parse(vendor_services.services_types_id)
            //let sub_services = vendor_services.services_types_id
            for(let i=0;i<sub_services.length;i++){
                let service_sub = {
                    user_id:request.user().id,
                    slug:request.user().id+'_service_parent_id'+sub_services[i],
                    service_id:sub_services[i],
                    identifier:'sub_services',
                    txt_field:null,
                    created_at: currentDateTime()
                }
                vendor_service_arr.push(service_sub)
            }
        }else{
            let get_sub_services = await VendorInformation.query().where('user_id',request.user().id).where('identifier','sub_services');
            for(let i=0;i<get_sub_services.length;i++){
                let service_sub = {
                    user_id:get_sub_services[i].user_id,
                    slug:request.user().id+'_service_parent_id'+get_sub_services[i].id,
                    service_id:get_sub_services[i].service_id,
                    identifier:'sub_services',
                    txt_field:null,
                    created_at: currentDateTime()
                }
                vendor_service_arr.push(service_sub)
            }
        }
        let service_area = {
            user_id:request.user().id,
            slug:request.user().id+'_service_area',
            service_id:0,
            identifier:'service_area',
            txt_field:!_.isEmpty(vendor_services.service_area) ? vendor_services.service_area : old_ser_two,
            created_at: currentDateTime()
        }
        vendor_service_arr.push(service_area)
        if(!_.isEmpty(vendor_services.available_hours)){
            let available_hours_arr = JSON.parse(vendor_services.available_hours)
            //let available_hours_arr = vendor_services.available_hours
            for(let j=0;j<available_hours_arr.length;j++){
                let available_hours = {
                    user_id:request.user().id,
                    slug:request.user().id+'_available_hours'+available_hours_arr[j],
                    service_id:available_hours_arr[j],
                    identifier:'available_hours',
                    txt_field:null,
                    created_at: currentDateTime()
                }
                vendor_service_arr.push(available_hours)
            }
        }else{
            let get_available_hours = await VendorInformation.query().where('user_id',request.user().id).where('identifier','available_hours');
            for(let i=0;i<get_available_hours.length;i++){
                let available_hours = {
                    user_id:get_available_hours[i].user_id,
                    slug:request.user().id+'_available_hours'+get_available_hours[i].id,
                    service_id:get_available_hours[i].service_id,
                    identifier:'available_hours',
                    txt_field:null,
                    created_at: currentDateTime()
                }
                vendor_service_arr.push(available_hours)
            }
        }
        if(!_.isEmpty(vendor_services.available_day)){
            let available_day_arr = JSON.parse(vendor_services.available_day)
            //let available_day_arr = vendor_services.available_day
            for(let k=0;k<available_day_arr.length;k++){
            let available_day = {
                user_id:request.user().id,
                slug:request.user().id+'_available_day'+available_day_arr[k],
                service_id:available_day_arr[k],
                identifier:'available_day',
                txt_field:null,
                created_at: currentDateTime()
            }
            vendor_service_arr.push(available_day)
            }
        }else{
            let get_available_day = await VendorInformation.query().where('user_id',request.user().id).where('identifier','available_day');
            for(let i=0;i<get_available_day.length;i++){
                let available_day = {
                    user_id:get_available_day[i].user_id,
                    slug:request.user().id+'_available_day'+get_available_day[i].id,
                    service_id:get_available_day[i].service_id,
                    identifier:'available_day',
                    txt_field:null,
                    created_at: currentDateTime()
                }
                vendor_service_arr.push(available_day)
            }
        }
        let per_hour_rate = {
            user_id:request.user().id,
            slug:request.user().id+'_per_hour_rate',
            service_id:0,
            identifier:'per_hour_rate',
            txt_field:!_.isEmpty(vendor_services.per_hour_rate) ? vendor_services.per_hour_rate : old_ser_five,
            created_at: currentDateTime()
        }
        vendor_service_arr.push(per_hour_rate)
        let experience_in_number = {
            user_id:request.user().id,
            slug:request.user().id+'_experience_in_number',
            service_id:0,
            identifier:'experience_in_number',
            txt_field:!_.isEmpty(vendor_services.experience_in_number) ? vendor_services.experience_in_number : old_ser_six,
            created_at: currentDateTime()
        }
        vendor_service_arr.push(experience_in_number)
        let experience_in_text = {
            user_id:request.user().id,
            slug:request.user().id+'_experience_in_text',
            service_id:0,
            identifier:'experience_in_text',
            txt_field:!_.isEmpty(vendor_services.experience_in_text) ? vendor_services.experience_in_text : old_ser_seven,
            created_at: currentDateTime()
        }
        vendor_service_arr.push(experience_in_text)
        let emergency_hour = {
            user_id:request.user().id,
            slug:request.user().id+'_emergency_hour',
            service_id:!_.isEmpty(vendor_services.emergency_hour) ? vendor_services.emergency_hour : old_ser_eight,
            identifier:'emergency_hour',
            txt_field:null,
            created_at: currentDateTime()
        }
        vendor_service_arr.push(emergency_hour)
        let description = {
            user_id:request.user().id,
            slug:request.user().id+'_description',
            service_id:0,
            identifier:'description',
            txt_field:!_.isEmpty(vendor_services.description) ? vendor_services.description : old_ser_nine,
            created_at: currentDateTime()
        }
        vendor_service_arr.push(description)
        let is_notification = {
            user_id:request.user().id,
            slug:request.user().id+'_is_notification',
            service_id:!_.isEmpty(vendor_services.is_notification) ? vendor_services.is_notification : old_ser_ten,
            identifier:'is_notification',
            txt_field:null,
            created_at: currentDateTime()
        }
        vendor_service_arr.push(is_notification)
        await VendorInformation.query().where('user_id',request.user().id).delete();
        await VendorInformation.createMany(vendor_service_arr)
        
        
    }

    /**
     * Hook for execute command after edit
     * @param {updated record object} record
     * @param {adonis request object} request
     * @param {payload object} params
     */
    public static async afterEditHook(request:any, slug:string)
    {
        let payload = request.all();
        //save user device token
        let record:any = await Vendor.query().where('slug',slug).first();
        //update or create device token
        if( !_.isEmpty(payload.device_type) && !_.isEmpty(payload.device_token) ){
          const searchPayload = { user_id:record.id, device_type:payload.device_type, device_token:payload.device_token }
          const persistancePayload = searchPayload
          UserDeviceToken.updateOrCreate(searchPayload, persistancePayload).then();
        }
    }

    /**
     * Hook for execute command before delete
     * @param {adonis request object} request
     * @param {payload object} params
     * @param {string} slug
     */
    public static async beforeDeleteHook(request:any, params:any, slug:string)
    {

    }

    /**
     * Hook for execute command after delete
     * @param {adonis request object} request
     * @param {payload object} params
     * @param {string} slug
     */
    public static async afterDeleteHook(request:any, params:any, slug:string)
    {

    }
}
