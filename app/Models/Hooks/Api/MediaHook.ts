import _ from 'lodash';
import { sendMail, currentDateTime } from 'App/Helpers/Index'
const moment = require('moment');
import Database from '@ioc:Adonis/Lucid/Database'
import FileUpload from 'App/Libraries/FileUpload/FileUpload'
import MdlMedia from 'App/Models/Media';

export default class MediaHook
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
        
    }

    /**
     * Hook for manipulate data input before add data is execute
     * @param {adonis request object} request
     * @param {payload object} params
     */
    public static async beforeCreateHook(request: any, params:any)
    {
        if( !_.isEmpty(request.file('file_url')) ){
            if(params.file_type == 'image'){
                params.file_url  = await FileUpload.doUpload(request.file('file_url'),'user');
            }else if(params.file_type == 'video'){
                params.file_url  = await FileUpload.doUpload(request.file('file_url'),'user');
            }else if(params.file_type == 'audio'){
                params.file_url  = await FileUpload.doUpload(request.file('file_url'),'user');
            }else if(params.file_type == 'pdf'){
                params.file_url  = await FileUpload.doUpload(request.file('file_url'),'user');
            }

            if( !_.isEmpty(request.file('thumbnail_url')) ){
                params.thumbnail_url = await FileUpload.doUpload(request.file('thumbnail_url'),'user');
            }else{
                params.thumbnail_url = params.file_url
            }   

            let slug      = await MdlMedia.generateSlug('media_'+Math.floor( ( Math.random() * 100) + 1 ) + new Date().getTime());
            params.slug = slug;
            params.module = ''
            params.module_id = 0
            params.filename = 'dumy_'+Math.floor( ( Math.random() * 100) + 1 ) + new Date().getTime();
            params.original_name = 'dumy_'+Math.floor( ( Math.random() * 100) + 1 ) + new Date().getTime();
            params.file_url = params.file_url;
            params.file_url_blur = '0000'
            params.thumbnail_url = params.thumbnail_url
            params.mime_type = params.file_type
            params.file_type = params.file_type
            params.driver = ''        
            params.media_type = 'public'   
            params.meta = ''
            params.created_at = currentDateTime();
        }
        
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
