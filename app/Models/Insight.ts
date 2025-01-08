import { column,hasOne,HasOne,hasMany,HasMany } from '@ioc:Adonis/Lucid/Orm'
import { strSlug, rand, currentDateTime } from 'App/Helpers/Index'
import User from 'App/Models/User'
import InsightData from 'App/Models/InsightData'
import _ from 'lodash'
import { DateTime } from 'luxon'
import RestModel from './RestModel'

export default class Insight extends RestModel
{
    public static table = 'insights'

    @column({ isPrimary: true })
    public id: number

    @column()
    public title: string

    @column()
    public slug: string

    @column()
    public insight_type: number

    @column()
    public user_id: number

    @column()
    public image_url: string

    @column()
    public description: string

    @column()
    public total_favourite: number

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

    @hasMany(() => InsightData, {
      foreignKey: 'insight_id',
      localKey: 'id'
    })
    public InsightData: HasMany<typeof InsightData>


    public static fillable()
    {
        return [
          'title','slug','insight_type','user_id','image_url','description','total_favourite','status','created_at','updated_at','deleted_at'
        ]
    }

    public static async generateSlug(name:string)
    {
        let slug = strSlug(name);
        let query = await this.query().where('slug',slug).count('id as total');
        return query[0].$extras.total == 0 ? slug : slug + query[0].$extras.total + rand(111,999);
    }

}
