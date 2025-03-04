import { column,hasOne,HasOne,hasMany,HasMany } from '@ioc:Adonis/Lucid/Orm'
import Database from '@ioc:Adonis/Lucid/Database'
import Hash from '@ioc:Adonis/Core/Hash'
import { strSlug, rand, currentDateTime } from 'App/Helpers/Index'
import _ from 'lodash'
import { DateTime } from 'luxon'
import RestModel from './RestModel'
import User from 'App/Models/User'

export default class Chat extends RestModel
{
    public static table = 'chats'

    @column({ isPrimary: true })
    public id: number

    @column()
    public sender_id: number

    @column()
    public reciever_id: number

    @column()
    public slug: string

    @column()
    public group_id: string

    @column()
    public message: string

    @column()
    public file: string

    @column()
    public seen: string

    @column()
    public delivered: string

    @column()
    public type: string

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
          'sender_id','reciever_id','slug','group_id','message','file','seen','delivered','type','created_at','updated_at','deleted_at'
        ]
    }

    public static async generateSlug(name:string)
    {
        let slug = strSlug(name);
        let query = await this.query().where('slug',slug).count('id as total');
        return query[0].$extras.total == 0 ? slug : slug + query[0].$extras.total + rand(111,999);
    }

    public static async getById(id:number)
    {
        let query = await this.query().where('id',id).preload('Sender').preload('Reciever').first();
        return query?.toJSON();
    }

    public static async getlastMessage(group_id:number)
    {
        let query = await this.query().where('group_id',group_id).preload('Sender').preload('Reciever').first();
        return query?.toJSON();
    }

    public static async updateChat(data:any,condition:any)
    {
      await this.query().where(condition).update(data);
      return true
    }

    public static async getRecentChat(group_id:number)
    {
        let query = await this.query().where('group_id',group_id).preload('Sender').preload('Reciever');
        return query;
    }

    public static async getCountUnseenMessages(group_id:number,reciever_id)
    {
        let query = await this.query().where('group_id',group_id).where('reciever_id',reciever_id).where('seen','1').getCount();
        return query;
    }

    static async createChat(params: object): Promise<any> {
      let slug = await this.generateSlug('ch_'+params.sender_id+params.reciever_id)
      let record = await this.create({ ...params, slug: slug })
      let getChat = await this.getById(record.id);
      return getChat; 
    }
}
