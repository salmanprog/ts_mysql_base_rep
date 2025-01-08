import { column,hasOne,HasOne,hasMany,HasMany } from '@ioc:Adonis/Lucid/Orm'
import { strSlug, rand, currentDateTime } from 'App/Helpers/Index'
import User from 'App/Models/User'
import Insight from 'App/Models/Insight'
import _ from 'lodash'
import { DateTime } from 'luxon'
import RestModel from './RestModel'
import Database from '@ioc:Adonis/Lucid/Database'

export default class InsightFavorite extends RestModel
{
    public static table = 'insight_favorites'

    @column({ isPrimary: true })
    public id: number

    @column()
    public slug: string

    @column()
    public user_id: number

    @column()
    public insight_id: number

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

    @hasOne(() => Insight, {
      foreignKey: 'id',
      localKey: 'insight_id'
    })
  public Insight: HasOne<typeof Insight>

    public static fillable()
    {
        return [
          'slug','user_id','insight_id','status','created_at','updated_at','deleted_at'
        ]
    }

    public static async generateSlug(name:string)
    {
        let slug = strSlug(name);
        let query = await this.query().where('slug',slug).count('id as total');
        return query[0].$extras.total == 0 ? slug : slug + query[0].$extras.total + rand(111,999);
    }

    public static async favouriteItemDelete(insight_id:number,user_id:number)
    {
        let record = await this.query().where('insight_id',insight_id).where('user_id',user_id).delete();
        let getInsight = await Insight.query().where('id',insight_id).first();
        if(getInsight.total_favourite > 0){
        let total_fav = parseInt(getInsight.total_favourite) - parseInt(1)
        await Database.query().from('insights').where('id',insight_id).update({
              total_favourite: total_fav
          })
        }
        return record;
    }

}
