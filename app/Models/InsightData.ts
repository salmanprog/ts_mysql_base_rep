import { column,hasOne,HasOne,hasMany,HasMany } from '@ioc:Adonis/Lucid/Orm'
import { strSlug, rand, currentDateTime } from 'App/Helpers/Index'
import User from 'App/Models/User'
import _ from 'lodash'
import { DateTime } from 'luxon'
import RestModel from './RestModel'

export default class InsightData extends RestModel
{
    public static table = 'insights_data'

    @column({ isPrimary: true })
    public id: number

    @column()
    public title: string

    @column()
    public slug: string

    @column()
    public insight_id: number

    @column()
    public image_url: string

    @column()
    public description: string

    @column()
    public status: number

    @column.dateTime({ autoCreate: true })
    public created_at: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updated_at: DateTime

    @column()
    public deleted_at: DateTime | null

    public static fillable()
    {
        return [
          'title','slug','insight_id','image_url','description','status','created_at','updated_at','deleted_at'
        ]
    }

    public static async generateSlug(name:string)
    {
        let slug = strSlug(name);
        let query = await this.query().where('slug',slug).count('id as total');
        return query[0].$extras.total == 0 ? slug : slug + query[0].$extras.total + rand(111,999);
    }

}
