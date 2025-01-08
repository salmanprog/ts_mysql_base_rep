import _, { round } from 'lodash';
import PropertyTask from 'App/Models/PropertyTask';
import { currentDateTime } from 'App/Helpers/Index'
import moment from 'moment';
import Notification from 'App/Models/Notification';
import PropertyTask from 'App/Models/PropertyTask';
import Database from '@ioc:Adonis/Lucid/Database'

export default class PropertyTaskHook
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
        let params = request.all();
        if(!_.isEmpty(params.property_id)){
            query.where('property_id',params.property_id)
        }
        if(!_.isEmpty(params.task_status)){
            query.where('task_status',params.task_status)
        }
       query.preload('Property').preload('User').where('user_id',request.user().id).where('status',1)
    }

    /**
     * Hook for manipulate data input before add data is execute
     * @param {adonis request object} request
     * @param {payload object} params
     */
    public static async beforeCreateHook(request: any, params:any)
    {
        let task_notification_date = '';
        if(!_.isEmpty(params.task_date)){
            if(params.notification_send_by == 'do_not_repeat'){
                task_notification_date =  params.task_date;
            }else if(params.notification_send_by == 'every_day'){
                task_notification_date = moment(params.task_date, "YYYY-MM-DD").add(1, 'days').format("YYYY-MM-DD");
            }else if(params.notification_send_by == 'every_week'){
                task_notification_date = moment(params.task_date, "YYYY-MM-DD").add(7, 'days').format("YYYY-MM-DD");
            }else if(params.notification_send_by == 'every_month'){
                task_notification_date = moment(params.task_date, "YYYY-MM-DD").add(30, 'days').format("YYYY-MM-DD");
            }else if(params.notification_send_by == 'every_year'){
                task_notification_date = moment(params.task_date, "YYYY-MM-DD").add(365, 'days').format("YYYY-MM-DD");
            }
        }
        let propertytitle      = await PropertyTask.generateSlug(params.title);
        params.slug       = propertytitle
        params.user_id = request.user().id
        params.task_notification_date = task_notification_date
        params.task_notification_time = params.task_time
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
        let user = request.user();
        let getTotalTask = await PropertyTask.getTotalTask(user.id,'0');
        let getTotalTaskCompleted = await PropertyTask.getTotalTask(user.id,'complete');
        let getTotalTaskPending = await PropertyTask.getTotalTask(user.id,'pending');
        let average_task = (getTotalTask * getTotalTaskCompleted) / 100;

        await Database.query().from('users').where('id',user.id).update({
            total_property_task: getTotalTask,
            total_property_task_complete: getTotalTaskCompleted,
            total_property_task_pending: getTotalTaskPending
        })

        // let targetUsers = request.user();
        
        // let notification_data = {
        //   actor: user,
        //   target: targetUsers,
        //   module: 'property_task_create',
        //   module_id: record.id,
        //   module_slug: record.slug,
        //   reference_id: record.id,
        //   reference_module: 'property_task_create',
        //   reference_slug: record.slug,
        //   title: 'New Task',
        //   message: record.title+' task created',
        //   identifier: 'property_task_create',
        //   redirect_link: null,
        // }

        // let custom_data = {
        //   record_id: record.id,
        //   reference_slug: record.slug,
        //   slug: record.slug,
        //   redirect_link: null,
        //   identifier: 'property_task_create',
        // }

        // Notification.sendPushNotification('property_task_create', notification_data, custom_data, true, false);
    }

    /**
     * Hook for manipulate data input before update data is execute
     * @param {adonis request object} request
     * @param {payload object} params
     * @param {string} slug
     */
    public static async beforeEditHook(request:any, params:any, slug:string)
    {
        let task_notification_date = '';
        if(!_.isEmpty(params.task_date)){
            if(params.notification_send_by == 'do_not_repeat'){
                task_notification_date =  params.task_date;
            }else if(params.notification_send_by == 'every_day'){
                task_notification_date = moment(params.task_date, "YYYY-MM-DD").add(1, 'days').format("YYYY-MM-DD");
            }else if(params.notification_send_by == 'every_week'){
                task_notification_date = moment(params.task_date, "YYYY-MM-DD").add(7, 'days').format("YYYY-MM-DD");
            }else if(params.notification_send_by == 'every_month'){
                task_notification_date = moment(params.task_date, "YYYY-MM-DD").add(30, 'days').format("YYYY-MM-DD");
            }else if(params.notification_send_by == 'every_year'){
                task_notification_date = moment(params.task_date, "YYYY-MM-DD").add(365, 'days').format("YYYY-MM-DD");
            }
        }
        params.task_notification_date = task_notification_date
        params.task_notification_time = params.task_time
    }

    /**
     * Hook for execute command after edit
     * @param {updated record object} record
     * @param {adonis request object} request
     * @param {payload object} params
     */
    public static async afterEditHook(request:any, slug:string)
    {
        let user = request.user();
        let getTotalTask = await PropertyTask.getTotalTask(user.id,'0');
        let getTotalTaskCompleted = await PropertyTask.getTotalTask(user.id,'complete');
        let getTotalTaskPending = await PropertyTask.getTotalTask(user.id,'pending');
        let average_task = (getTotalTask * getTotalTaskCompleted) / 100;

        await Database.query().from('users').where('id',user.id).update({
            total_property_task: getTotalTask,
            total_property_task_complete: getTotalTaskCompleted,
            total_property_task_pending: getTotalTaskPending
        })
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
        let user = request.user();
        let getTotalTask = await PropertyTask.getTotalTask(user.id,'0');
        let getTotalTaskCompleted = await PropertyTask.getTotalTask(user.id,'complete');
        let getTotalTaskPending = await PropertyTask.getTotalTask(user.id,'pending');
        let average_task = (getTotalTask * getTotalTaskCompleted) / 100;

        await Database.query().from('users').where('id',user.id).update({
            total_property_task: getTotalTask,
            total_property_task_complete: getTotalTaskCompleted,
            total_property_task_pending: getTotalTaskPending
        })
    }
}
