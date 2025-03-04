import { column,hasOne,HasOne,hasMany,HasMany } from '@ioc:Adonis/Lucid/Orm'
import Database from '@ioc:Adonis/Lucid/Database'
import Hash from '@ioc:Adonis/Core/Hash'
import { strSlug, rand, currentDateTime } from 'App/Helpers/Index'
import _ from 'lodash'
import { DateTime } from 'luxon'
import RestModel from './RestModel'
import User from 'App/Models/User'

export default class ChatGroup extends RestModel
{
    public static table = 'chat_groups'

    @column({ isPrimary: true })
    public id: number

    @column()
    public sender_id: number

    @column()
    public reciever_id: number

    @column()
    public slug: string

    @column()
    public reciever_seen: string

    @column()
    public sender_seen: string

    @column()
    public total_unread_messages: string

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
          'sender_id','reciever_id','slug','reciever_seen','sender_seen','total_unread_messages','created_at','updated_at','deleted_at'
        ]
    }

    public static async generateSlug(name:string)
    {
        let slug = strSlug(name);
        let query = await this.query().where('slug',slug).count('id as total');
        return query[0].$extras.total == 0 ? slug : slug + query[0].$extras.total + rand(111,999);
    }

    public static async updateGroup(data:any,condition:any)
    {
      await this.query().where(condition).update(data);
      return true
    }

    public static async checkChat(sender_id:number,reciever_id:number)
    {
        let check_first = await this.query().where('sender_id',sender_id).where('reciever_id',reciever_id).first();
        let check_two = await this.query().where('reciever_id',sender_id).where('sender_id',reciever_id).first();
        if(!_.isEmpty(check_first)){
            return check_first.toJSON();
        }else if(!_.isEmpty(check_two)){
            return check_two.toJSON();
        }else{
            let params = {
              sender_id:sender_id,
              reciever_id:reciever_id,
              slug: await this.generateSlug('cg_'+sender_id+reciever_id),
              reciever_seen:'0',
              sender_seen:'0',
              total_unread_messages:'0',
              created_at:currentDateTime()
            }
            //insert record
            var record:any = await this.create(params);
            return record;
        }
    }

    public static async getGroupId(sender_id:number,reciever_id:number)
    {
        let check_first = await this.query().where('sender_id',sender_id).where('reciever_id',reciever_id).first();
        let check_two = await this.query().where('reciever_id',sender_id).where('sender_id',reciever_id).first();
        if(!_.isEmpty(check_first)){
            return check_first.toJSON();
        }else if(!_.isEmpty(check_two)){
            return check_two.toJSON();
        }else{
            return {};
        }
    }

    public static async getRecentChat(vendor_id:number)
    {
        let query:any = this.query().select().whereNull("deleted_at");
        query.where(function (filter) {
            filter.where('reciever_id',vendor_id)
                .orWhere('sender_id',vendor_id);
        }); 
        let record_limit = parseInt('2');
        query.preload('Sender').preload('Reciever')
        query = await query.limit(record_limit).orderBy('updated_at', 'desc');
        return query;
    }
}
