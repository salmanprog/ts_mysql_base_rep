import _ from 'lodash';
import AdminVendorCategory from 'App/Models/AdminVendorCategory';
import { currentDateTime } from 'App/Helpers/Index'

export default class AdminVendorCategoryHook
{
    private static except_update_params: string[] = [
        'slug'
          ];

     /**
     * Hook for manipulate query of index result
     * @param {current mongo query} query
     * @param {adonis request object} request
     * @param {object} slug
     */
    public static async indexQueryHook(query: any, request: any, slug:string = '')
    {
        if( typeof request.apiToken == 'function' && !_.isEmpty(slug) )
        {
            console.log('slug')
        }else{
            let get_cats_ids = await AdminVendorCategory.getCategoryHierarchy(1);
            query.whereIn('id',get_cats_ids).where('id','<>',1).where('status',1)
        }
       //query.where('parent_id',0).where('status',1)
    }

    /**
     * Hook for manipulate data input before add data is execute
     * @param {adonis request object} request
     * @param {payload object} params
     */
    public static async beforeCreateHook(request: any, params:any)
    {
        let propertytitle      = await AdminVendorCategory.generateSlug(params.title);
            params.slug       = propertytitle
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
