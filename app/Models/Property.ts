import { column,hasOne,HasOne,hasMany,HasMany } from '@ioc:Adonis/Lucid/Orm'
import { strSlug, rand, currentDateTime } from 'App/Helpers/Index'
import User from 'App/Models/User'
import _ from 'lodash'
import { DateTime } from 'luxon'
import RestModel from './RestModel'
import { NumberContext } from 'twilio/lib/rest/pricing/v1/voice/number'
import PropertyTask from 'App/Models/PropertyTask'

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
    public property_extra_space: string

    @column()
    public property_landscape: string

    @column()
    public property_air_conditions: number

    @column()
    public property_furnace: number

    @column()
    public property_solar_panel: number

    @column()
    public property_household: string

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

    @hasMany(() => PropertyTask, {
    foreignKey: 'property_id',
    localKey: 'id'
    })
    public PropertyTask: HasMany<typeof PropertyTask> 

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
        if(category_col == 'property_extra_space' || category_col == 'property_household' || category_col == 'property_landscape'){
            let get_cat_arr:any = this.query()
                            .select(category_col)
                            .whereNull("deleted_at");
            let cat_arr = await get_cat_arr.where('id',id).where('status',1).first();
            cat_arr = cat_arr.toJSON()
            let arr_cat = ''
            if(category_col == 'property_extra_space'){
                arr_cat = cat_arr.property_extra_space.split(",");
            }else if(category_col == 'property_household'){
                arr_cat = cat_arr.property_household.split(",");
            }else if(category_col == 'property_landscape'){
                arr_cat = cat_arr.property_landscape.split(",");
            }
            let check_id = arr_cat.includes(category_id.toString());
            if(check_id == true){
                return 1;
            }else{
                return 0;
            }
        }else{
            let query = await this.query().where('id',id).where(category_col,category_id).count('id as total');
            return query[0].$extras.total == 0 ? 0 : 1;
        }
      
        
    }

    public static async getTotalProperty(user_id:NumberContext)
        {
            let query:any  = this.query()
                                  .select()
                                  .whereNull("deleted_at");
                  query = query.where('user_id',user_id)
    
             query = await query.count('id as total');
            return query[0].$extras.total;
        }
}
