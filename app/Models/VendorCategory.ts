import { column,hasOne,HasOne,hasMany,HasMany } from '@ioc:Adonis/Lucid/Orm'
import { strSlug, rand, currentDateTime } from 'App/Helpers/Index'
import _ from 'lodash'
import { DateTime } from 'luxon'
import RestModel from './RestModel'

export default class VendorCategory extends RestModel
{
    public static table = 'vendor_categories'

    @column({ isPrimary: true })
    public id: number

    @column()
    public title: string

    @column()
    public slug: string

    @column()
    public parent_id: number

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
          'title','slug','parent_id','status','created_at','updated_at','deleted_at'
        ]
    }

    public static async generateSlug(name:string)
    {
        let slug = strSlug(name);
        let query = await this.query().where('slug',slug).count('id as total');
        return query[0].$extras.total == 0 ? slug : slug + query[0].$extras.total + rand(111,999);
    }

    public static async getSubCategory(id:number)
    {
        let query = await this.query()
                        .select('id','title','slug')
                        .where('parent_id',id)
                        .where('status',1);                   
        return query;
    }

    public static async getCategory(id:number)
    {
        let query:any = this.query()
                        .select('id','title','slug')
                        .whereNull("deleted_at");
        let record = await query.where('id',id).where('status',1).first();
            record = record.toJSON();                  
        return record;
    }

    public static async getCat(id:number)
    {
        let query:any = this.query()
                        .select('id','title','slug')
                        .whereNull("deleted_at");
        let record = await query.where('id',id).where('status',1).first();
        return record;
    }

    public static async getSubCat(identifier:string)
    {
        let query = await this.query()
                        .select('id','title','slug')
                        .where('identifier',identifier)
                        .where('status',1);                   
        return query;
    }
}
