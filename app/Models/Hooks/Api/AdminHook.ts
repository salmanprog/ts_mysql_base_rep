import _ from 'lodash';
import FileUpload from 'App/Libraries/FileUpload/FileUpload'
import User from 'App/Models/User';
import UserDeviceToken from 'App/Models/UserDeviceToken';
const moment = require('moment');

export default class AdminHook
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
        query.where('user_type','admin');
        
    }

    /**
     * Hook for manipulate data input before add data is execute
     * @param {adonis request object} request
     * @param {payload object} params
     */
    public static async beforeCreateHook(request: any, params:any)
    {
        
    }

    /**
     * Hook for execute command after add public static function called
     * @param {saved record object} record
     * @param {adonis request object} request
     * @param {payload object} params
     */
    public static async afterCreateHook(record:any, request:any, params:any)
    {
        
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
