import { column,hasOne,HasOne,hasMany,HasMany } from '@ioc:Adonis/Lucid/Orm'
import { strSlug, rand, currentDateTime } from 'App/Helpers/Index'
import _ from 'lodash'
import { DateTime } from 'luxon'
import RestModel from './RestModel'
import User from 'App/Models/User'
import Database from '@ioc:Adonis/Lucid/Database'

export default class SeasnoalTask extends RestModel
{
    public static table = 'seasonal_tasks'

    @column({ isPrimary: true })
    public id: number

    @column()
    public user_id: number

    @column()
    public category_id: number

    @column()
    public title: string

    @column()
    public description: string

    @column()
    public slug: string

    @column()
    public image_url: string

    @column()
    public task_date: string

    @column()
    public task_time: string

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

    public static fillable()
    {
        return [
          'user_id','category_id','title','description','slug','image_url','task_date','task_time','created_at','updated_at','deleted_at'
        ]
    }

    public static async generateSlug(name:string)
    {
        let slug = strSlug(name);
        let query = await this.query().where('slug',slug).count('id as total');
        return query[0].$extras.total == 0 ? slug : slug + query[0].$extras.total + rand(111,999);
    }

    public static async getUserTask(id:number)
    {
        let record = await this.query().select('id','category_id','title','slug','task_date','task_time','created_at').where('id',id).whereNull('deleted_at').first();
        return record?.toJSON();
    }
}
