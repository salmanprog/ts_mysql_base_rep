import { column,hasOne,HasOne,hasMany,HasMany } from '@ioc:Adonis/Lucid/Orm'
import { strSlug, rand, currentDateTime } from 'App/Helpers/Index'
import User from 'App/Models/User'
import Property from 'App/Models/Property'
import _ from 'lodash'
import { DateTime } from 'luxon'
import RestModel from './RestModel'

export default class PropertyTask extends RestModel
{
    public static table = 'property_tasks'

    @column({ isPrimary: true })
    public id: number

    @column()
    public title: string

    @column()
    public slug: string

    @column()
    public user_id: number

    @column()
    public property_id: number

    @column()
    public description: string

    @column()
    public task_date: string

    @column()
    public task_time: string

    @column()
    public notification_send_by: string

    @column()
    public task_notification_date: string

    @column()
    public task_notification_time: string

    @column()
    public is_notify: number

    @column()
    public task_status: number

    @column()
    public status: number

    @column.dateTime({ autoCreate: true })
    public created_at: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updated_at: DateTime

    @column()
    public deleted_at: DateTime | null

    @hasOne(() => User, {
        foreignKey: 'id',
        localKey: 'user_id'
      })
      public User: HasOne<typeof User>

    @hasOne(() => Property, {
        foreignKey: 'id',
        localKey: 'property_id'
      })
      public Property: HasOne<typeof Property>  


    public static fillable()
    {
        return [
          'title','slug','user_id','property_id','description','task_date','task_time','notification_send_by','task_notification_date','task_notification_time','is_notify','task_status','status','created_at','updated_at','deleted_at'
        ]
    }

    public static async generateSlug(name:string)
    {
        let slug = strSlug(name);
        let query = await this.query().where('slug',slug).count('id as total');
        return query[0].$extras.total == 0 ? slug : slug + query[0].$extras.total + rand(111,999);
    }

    public static async getTotalTask(user_id:number,task_status:string)
    {
        let query:any  = this.query()
                              .select()
                              .whereNull("deleted_at");
            if(!_.isEmpty(user_id)){
              query = query.where('user_id',user_id)
            }
            if(!_.isEmpty(task_status) && task_status != '0'){
              query = query.where('task_status',task_status)
            }

         query = await query.count('id as total');
        return query[0].$extras.total;
    }
}
