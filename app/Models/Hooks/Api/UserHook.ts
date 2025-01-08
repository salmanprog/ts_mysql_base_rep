import _ from 'lodash';
import FileUpload from 'App/Libraries/FileUpload/FileUpload'
import User from 'App/Models/User';
import Hash from '@ioc:Adonis/Core/Hash'
import { sendMail, currentDateTime } from 'App/Helpers/Index'
import Database from '@ioc:Adonis/Lucid/Database'
import Application  from '@ioc:Adonis/Core/Application'
import Encryption from '@ioc:Adonis/Core/Encryption'
import Env from '@ioc:Adonis/Core/Env'
import UserDeviceToken from 'App/Models/UserDeviceToken';
const moment = require('moment');

export default class UserHook
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
        query.select('users.*')
        if( typeof request.apiToken == 'function' && !_.isEmpty(slug) )
        {
          query.preload('userApiToken', (userApiTokenQuery) => {
            userApiTokenQuery.where('api_token', request.apiToken())
          })
        }
        query.preload('Subscription');
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
        let username      = await User.generateSlug(params.name);
        let current_date = moment().format("YYYY-MM-DD")
        //params.user_group_id = 3;
        params.user_type  = (params.user_group_id == 3) ? 'user' : 'vendor';
        params.password   = await Hash.make(params.password)
        params.username   = username
        params.slug       = username
        params.is_email_verify       = 1
        params.subscripton_id = !_.isEmpty(params.subscripton_id) ? params.subscripton_id : "1"
        params.subscription_start_date = current_date
        params.subscription_end_date = moment(moment().format(current_date,"YYYY-MM-DD")).add(3, 'days').format("YYYY-MM-DD")
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
        let record:any = await User.query().where('slug',slug).first();
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
