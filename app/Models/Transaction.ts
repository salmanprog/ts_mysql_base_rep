import { column,hasOne,HasOne,hasMany,HasMany } from '@ioc:Adonis/Lucid/Orm'
import { strSlug, rand, currentDateTime } from 'App/Helpers/Index'
import _ from 'lodash'
import { DateTime } from 'luxon'
import RestModel from './RestModel'
import User from 'App/Models/User'
import Subscription from 'App/Models/Subscription';
import Database from '@ioc:Adonis/Lucid/Database'

export default class Transaction extends RestModel
{
    public static table = 'transactions'

    @column({ isPrimary: true })
    public id: number

    @column()
    public slug: string

    @column()
    public user_id: number

    @column()
    public subscription_id: number

    @column()
    public transaction_id: string

    @column()
    public gateway_type: string

    @column()
    public subscription_title: string

    @column()
    public subscription_amount: number

    @column()
    public subscription_start_date: string

    @column()
    public subscription_end_date: string

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
    
      @hasOne(() => Subscription, {
        foreignKey: 'id',
        localKey: 'subscription_id'
      })
      public Subscription: HasOne<typeof Subscription>

    public static fillable()
    {
        return [
          'user_id','subscription_id','transaction_id','gateway_type','subscription_title','subscription_amount','subscription_start_date','subscription_end_date','slug','created_at','updated_at','deleted_at'
        ]
    }

    public static async generateSlug(name:string)
    {
        let slug = strSlug(name);
        let query = await this.query().where('slug',slug).count('id as total');
        return query[0].$extras.total == 0 ? slug : slug + query[0].$extras.total + rand(111,999);
    }
}
