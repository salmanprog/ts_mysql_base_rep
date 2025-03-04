import { column,hasOne,HasOne,hasMany,HasMany } from '@ioc:Adonis/Lucid/Orm'
import { strSlug, rand, currentDateTime } from 'App/Helpers/Index'
import _ from 'lodash'
import { DateTime } from 'luxon'
import RestModel from './RestModel'
import { NumberContext } from 'twilio/lib/rest/pricing/v2/voice/number'

export default class SeasnoalTaskSelected extends RestModel
{
    public static table = 'selected_seasnoal_tasks'

    @column({ isPrimary: true })
    public id: number

    @column()
    public user_id: number

    @column()
    public seasnoal_task_id: NumberContext

    @column()
    public slug: string

    @column.dateTime({ autoCreate: true })
    public created_at: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updated_at: DateTime

    @column()
    public deleted_at: DateTime | null

    public static fillable()
    {
        return [
          'user_id','seasnoal_task_id','slug','created_at','updated_at','deleted_at'
        ]
    }

    public static async generateSlug(name:string)
    {
        let slug = strSlug(name);
        let query = await this.query().where('slug',slug).count('id as total');
        return query[0].$extras.total == 0 ? slug : slug + query[0].$extras.total + rand(111,999);
    }

    public static async userSelected(user_id:number,seasnoal_task_id:number)
    {
        let query = await this.query().where('user_id',user_id).where('seasnoal_task_id',seasnoal_task_id).count('id as total');
        return query[0].$extras.total;
    }

}
