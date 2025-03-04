import _ from 'lodash';
import { sendMail, currentDateTime } from 'App/Helpers/Index'
import Chat from 'App/Models/Chat';
import User from 'App/Models/User';
const moment = require('moment');
import Database from '@ioc:Adonis/Lucid/Database'

export default class ChatGroup
{
    private static except_update_params: string[] = [
        'slug',
      ];

     /**
     * Hook for manipulate query of index result
     * @param {current mongo query} query
     * @param {adonis request object} request
     * @param {object} slug
     */
    public static async indexQueryHook(query: any, request: any, slug:string = '')
    {
        query.where(function (query) {
            query.where('reciever_id',request.user().id)
                .orWhere('sender_id',request.user().id);
        }); 
       query.preload('Sender').preload('Reciever').orderBy('updated_at', 'desc')
        //query.where('reciever_id',request.user().id);
    }

    /**
     * Hook for manipulate data input before add data is execute
     * @param {adonis request object} request
     * @param {payload object} params
     */
    public static async beforeCreateHook(request: any, params:any)
    {
        let slug      = await Chat.generateSlug('cg_'+params.sender_id+params.reciever_id);
        let current_date = moment().format("YYYY-MM-DD")
        params.slug       = slug
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
    }

    /**
     * Hook for execute command after edit
     * @param {updated record object} record
     * @param {adonis request object} request
     * @param {payload object} params
     */
    public static async afterEditHook(request:any, slug:string)
    {
        
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
