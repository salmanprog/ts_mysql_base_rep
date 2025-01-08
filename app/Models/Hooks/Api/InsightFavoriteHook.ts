import _ from 'lodash';
import InsightFavorite from 'App/Models/InsightFavorite';
import { currentDateTime } from 'App/Helpers/Index'
import Insight from 'App/Models/Insight'
import Database from '@ioc:Adonis/Lucid/Database'

export default class InsightFavoriteHook
{
    private static except_update_params: string[] = [
        'slug',
        'user_id'
          ];

     /**
     * Hook for manipulate query of index result
     * @param {current mongo query} query
     * @param {adonis request object} request
     * @param {object} slug
     */
    public static async indexQueryHook(query: any, request: any, slug:string = '')
    {
       query.preload('User').preload('Insight',function(usr){
            usr.preload('User').preload('InsightData')
       }).where('user_id',request.user().id).where('status',1)
    }

    /**
     * Hook for manipulate data input before add data is execute
     * @param {adonis request object} request
     * @param {payload object} params
     */
    public static async beforeCreateHook(request: any, params:any)
    {
        let insighttitle      = await InsightFavorite.generateSlug('fav_1');
        params.slug       = insighttitle
        params.user_id = request.user().id
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
       let getInsight = await Insight.query().where('id',request.all().insight_id).first();
       let total_fav = parseInt(getInsight.total_favourite) + parseInt(1)
       await Database.query().from('insights').where('id',request.all().insight_id).update({
            total_favourite: total_fav
        })
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
