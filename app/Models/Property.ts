import { column,hasOne,HasOne,hasMany,HasMany } from '@ioc:Adonis/Lucid/Orm'
import { strSlug, rand, currentDateTime } from 'App/Helpers/Index'
import User from 'App/Models/User'
import _ from 'lodash'
import { DateTime } from 'luxon'
import RestModel from './RestModel'

export default class Property extends RestModel
{
    public static table = 'properties'

    @column({ isPrimary: true })
    public id: number

    @column()
    public name: string

    @column()
    public slug: string

    @column()
    public user_id: number

    @column()
    public image_url: string

    @column()
    public country: string

    @column()
    public city: string

    @column()
    public state: string

    @column()
    public zipcode: string

    @column()
    public address: string

    @column()
    public latitude: string

    @column()
    public longitude: string

    @column()
    public property_types: number

    @column()
    public property_colors: number

    @column()
    public property_home: number

    @column()
    public property_rooms: number

    @column()
    public property_extra_space: number

    @column()
    public property_landscape: number

    @column()
    public property_air_conditions: number

    @column()
    public property_furnace: number

    @column()
    public property_solar_panel: number

    @column()
    public property_household: number

    @column()
    public property_notification: number

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


    public static fillable()
    {
        return [
          'name','slug','user_id','image_url','country','city','state','zipcode','address','latitude','longitude','property_types','property_colors','property_home','property_rooms','property_extra_space','property_landscape','property_air_conditions','property_furnace','property_solar_panel','property_household','property_notification','status','created_at','updated_at','deleted_at'
        ]
    }

    public static async generateSlug(name:string)
    {
        let slug = strSlug(name);
        let query = await this.query().where('slug',slug).count('id as total');
        return query[0].$extras.total == 0 ? slug : slug + query[0].$extras.total + rand(111,999);
    }

    public static async checkCategory(id:number,category_id:number,category_col:string)
    {
        let query = await this.query().where('id',id).where(category_col,category_id).count('id as total');
        return query[0].$extras.total == 0 ? 0 : 1;
    }
}
