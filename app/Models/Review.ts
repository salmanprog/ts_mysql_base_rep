import { column,hasOne,HasOne,hasMany,HasMany } from '@ioc:Adonis/Lucid/Orm'
import Database from '@ioc:Adonis/Lucid/Database'
import Hash from '@ioc:Adonis/Core/Hash'
import { strSlug, rand, currentDateTime } from 'App/Helpers/Index'
import _ from 'lodash'
import { DateTime } from 'luxon'
import RestModel from './RestModel'
import User from 'App/Models/User'

export default class Review extends RestModel
{
    public static table = 'reviews'

    @column({ isPrimary: true })
    public id: number

    @column()
    public sender_id: number

    @column()
    public reciever_id: number

    @column()
    public slug: string

    @column()
    public description: string

    @column()
    public no_of_rating: string

    @column.dateTime({ autoCreate: true })
    public created_at: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updated_at: DateTime

    @column()
    public deleted_at: DateTime | null

    @hasOne(() => User, {
      foreignKey: 'id',
      localKey: 'sender_id'
    })
    public Sender: HasOne<typeof User>

    @hasOne(() => User, {
        foreignKey: 'id',
        localKey: 'reciever_id'
      })
      public Reciever: HasOne<typeof User>

    public static fillable()
    {
        return [
          'sender_id','reciever_id','slug','description','no_of_rating','created_at','updated_at','deleted_at'
        ]
    }

    public static async generateSlug(name:string)
    {
        let slug = strSlug(name);
        let query = await this.query().where('slug',slug).count('id as total');
        return query[0].$extras.total == 0 ? slug : slug + query[0].$extras.total + rand(111,999);
    }

    public static async recentReview(vendor_id:number)
    {
      let record = await this.query().where('reciever_id',vendor_id).whereNull('deleted_at').preload('Sender').preload('Reciever').first();
      return record;
    }

    public static async allReview(vendor_id:number)
    {
      let record = await this.query().where('reciever_id',vendor_id).whereNull('deleted_at').preload('Sender').preload('Reciever');
      return record;
    }
}
