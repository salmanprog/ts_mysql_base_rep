import _ from 'lodash';
import { currentDateTime } from 'App/Helpers/Index'
import ProfileVisit from 'App/Models/ProfileVisit';
import User from 'App/Models/User';
const moment = require('moment');

export default class ProfileVisitHook
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
            query.where('actor_id',request.user().id)
                .orWhere('target_id',request.user().id);
        }); 
        query.preload('Actor').preload('Target');
    }

    /**
     * Hook for manipulate data input before add data is execute
     * @param {adonis request object} request
     * @param {payload object} params
     */
    public static async beforeCreateHook(request: any, params:any)
    {
        
        let current_date = moment().format("YYYY-MM-DD")
        let month = moment().format("MM")
        let year = moment().format("YYYY")
        let already_exist = await ProfileVisit.query().where('month',month).where('year',year).where('actor_id',request.user().id).first();
        if(already_exist){
            await ProfileVisit.query().where('month',month).where('year',year).where('actor_id',request.user().id).delete();
        }
        let slug      = await ProfileVisit.generateSlug('pv_'+request.user().id+params.target_id);
        params.slug       = slug
        params.actor_id       = request.user().id
        params.month = month
        params.year = year
        params.visit_date = current_date
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
        let total_visit = await ProfileVisit.query().where('target_id',params.target_id).getCount();
        let update_vendor = await User.updateUser({'total_visit':total_visit},{'id':params.target_id})
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
