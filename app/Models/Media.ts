import { column,hasOne,HasOne,hasMany,HasMany } from '@ioc:Adonis/Lucid/Orm'
import Database from '@ioc:Adonis/Lucid/Database'
import Hash from '@ioc:Adonis/Core/Hash'
import { strSlug, rand, currentDateTime } from 'App/Helpers/Index'
import _ from 'lodash'
import { DateTime } from 'luxon'
import RestModel from './RestModel'
import User from 'App/Models/User'

export default class Media extends RestModel
{
    public static table = 'media'

    @column({ isPrimary: true })
    public id: number

    @column()
    public slug: string

    @column()
    public module: string | null

    @column()
    public module_id: number | null

    @column()
    public filename: string

    @column()
    public original_name: string | null

    @column()
    public file_url: string

    @column()
    public file_url_blur: string | null

    @column()
    public thumbnail_url: string | null

    @column()
    public mime_type: string | null

    @column()
    public file_type: string | null

    @column()
    public driver: string | null

    @column()
    public media_type: string | null

    @column()
    public meta: string | null

    @column.dateTime({ autoCreate: true })
    public created_at: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updated_at: DateTime

    @column()
    public deleted_at: DateTime | null


    public static fillable()
    {
        return [
          'slug','module','module_id','filename','original_name','file_url','file_url_blur','thumbnail_url','mime_type','file_type','driver','media_type','meta','created_at','updated_at','deleted_at'
        ]
    }

    public static async generateSlug(name:string)
    {
        let slug = strSlug(name);
        let query = await this.query().where('slug',slug).count('id as total');
        return query[0].$extras.total == 0 ? slug : slug + query[0].$extras.total + rand(111,999);
    }

    public static async getMediaByType(module_id,module,file_type = null)
    {
        let query = this.query()
                    .select('*')
                    .whereNull("deleted_at");
        if(!_.isEmpty(file_type)){
            query.where('file_type',file_type)
        }                    
        query = await query.where('module',module).where('module_id',module_id);
        return query;
    }

    public static async getById(id)
    {
        let query = this.query()
                    .select('*')
                    .whereNull("deleted_at");
        query = await query.where('id',id).first();
        return query.toJSON();
    }
}
