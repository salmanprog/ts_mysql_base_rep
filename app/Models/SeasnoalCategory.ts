import { column,hasOne,HasOne,hasMany,HasMany } from '@ioc:Adonis/Lucid/Orm'
import { strSlug, rand, currentDateTime } from 'App/Helpers/Index'
import _ from 'lodash'
import { DateTime } from 'luxon'
import RestModel from './RestModel'
import User from 'App/Models/User'
import SeasnoalTask from 'App/Models/SeasnoalTask'
import Database from '@ioc:Adonis/Lucid/Database'

export default class SeasnoalCategory extends RestModel
{
    public static table = 'seasonal_categories'

    @column({ isPrimary: true })
    public id: number

    @column()
    public user_id: number

    @column()
    public title: string

    @column()
    public description: string

    @column()
    public image_url: string

    @column()
    public slug: string

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
      public Actor: HasOne<typeof User>
    
    @hasMany(() => SeasnoalTask, {
        foreignKey: 'category_id',
        localKey: 'id'
        })
        public SeasnoalTask: HasMany<typeof SeasnoalTask> 

    public static fillable()
    {
        return [
          'user_id','title','description','image_url','slug','created_at','updated_at','deleted_at'
        ]
    }

    public static async generateSlug(name:string)
    {
        let slug = strSlug(name);
        let query = await this.query().where('slug',slug).count('id as total');
        return query[0].$extras.total == 0 ? slug : slug + query[0].$extras.total + rand(111,999);
    }

    public static async getUserCategory()
    {
        let record = await this.query().preload('SeasnoalTask').whereNull('deleted_at');
        return record;
    }
}
