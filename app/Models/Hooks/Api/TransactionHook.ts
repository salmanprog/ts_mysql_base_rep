import _ from 'lodash';
import { currentDateTime } from 'App/Helpers/Index'
import Transaction from 'App/Models/Transaction';
import User from 'App/Models/User';
const moment = require('moment');
import Subscription from 'App/Models/Subscription';

export default class TransactionHook
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
        query.preload('User').where('user_id',request.user().id)
    }   

    /**
     * Hook for manipulate data input before add data is execute
     * @param {adonis request object} request
     * @param {payload object} params
     */
    public static async beforeCreateHook(request: any, params:any)
    {
        
        let slug      = await Transaction.generateSlug('tr_'+request.user().id+params.subscription_id);
        let get_subscription = await Subscription.query().where('id',params.subscription_id).first();        
        let current_date = moment().format("YYYY-MM-DD")
        params.slug       = slug
        params.user_id  = request.user().id
        params.subscription_id = get_subscription?.id
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
        let user_update_params = {
            "transaction_id":params.transaction_id,
            "gateway_type":params.gateway_type,
            "is_subscription":(params.subscription_id > 1) ? "1" : "0",
            "subscripton_id":params.subscription_id,
            "subscription_title":params.subscription_title,
            "subscription_amount":params.subscription_amount,
            "subscription_start_date":params.subscription_start_date,
            "subscription_end_date":params.subscription_end_date
        }
        await User.updateUser(user_update_params,{"id":params.user_id})
    }

    /**
     * Hook for manipulate data input before update data is execute
     * @param {adonis request object} request
     * @param {payload object} params
     * @param {string} slug
     */
    public static async beforeEditHook(request:any, params:any, slug:string)
    {
        
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
