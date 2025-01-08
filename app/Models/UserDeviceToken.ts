import { column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import _ from 'lodash';
import RestModel from './RestModel'
import { currentDateTime } from 'App/Helpers/Index';
enum DeviceType{
  'web',
  'ios',
  'android'
}
export default class UserDeviceToken extends RestModel
{
    public static table = 'user_device_tokens'

    @column({ isPrimary: true })
    public id: number

    @column()
    public user_id: number

    @column()
    public device_type: DeviceType

    @column()
    public device_token: string

    @column.dateTime({ autoCreate: true })
    public created_at: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updated_at: DateTime

    @column()
    public deleted_at: DateTime | null

   public static async getOrCreate(user_id:number,device_type:string,device_token:string)
   {
      if( !_.isEmpty(device_token) && !_.isEmpty(device_token) ){
          const searchPayload = { user_id: user_id, device_token:device_token }
          const savePayload = {
              user_id: user_id,
              device_type: device_type,
              device_token: device_token,
              created_at: currentDateTime(),
          }
          let record = await this.firstOrCreate(searchPayload, savePayload)
          return record;
      }
   }
}
