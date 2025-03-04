import { column,hasOne,HasOne,hasMany,HasMany } from '@ioc:Adonis/Lucid/Orm'
import { strSlug, rand, currentDateTime } from 'App/Helpers/Index'
import _ from 'lodash'
import { DateTime } from 'luxon'
import RestModel from './RestModel'

export default class VendorInformation extends RestModel
{
    public static table = 'vendor_informations'

    @column({ isPrimary: true })
    public id: number

    @column()
    public user_id: number

    @column()
    public slug: string

    @column()
    public service_id: number

    @column()
    public identifier: string

    @column()
    public txt_field: string

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
          'user_id','slug','service_id','identifier','txt_field','status','created_at','updated_at','deleted_at'
        ]
    }

    public static async generateSlug(name:string)
    {
        let slug = strSlug(name);
        let query = await this.query().where('slug',slug).count('id as total');
        return query[0].$extras.total == 0 ? slug : slug + query[0].$extras.total + rand(111,999);
    }

    public static async getInformation(user_id:number)
    {
        let query:any = this.query()
                        .whereNull("deleted_at");
        let record = await query.where('user_id',user_id).where('status',1);
        let info = {}
        if(record){
                let parent_cat:any = this.query()
                    .whereNull("deleted_at");
                let parent_cat_record = await query.where('user_id',user_id).where('identifier','service_parent_id').where('status',1).first();
                let child_cat:any = this.query()
                    .whereNull("deleted_at");
                let child_cat_record = await query.where('user_id',user_id).where('identifier','sub_services').where('status',1);
                parent_cat_record = parent_cat_record.toJSON();
                console.log('user_info............................................',parent_cat_record)
        }
        return info;
    }
}
