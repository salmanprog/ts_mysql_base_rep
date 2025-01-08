import { DateTime } from 'luxon'
import { currentDateTime } from 'App/Helpers/Index'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import _ from 'lodash'
import User from 'App/Models/User'
import Admin from 'firebase-admin';
import Config from '@ioc:Adonis/Core/Config'
import PushNotification from 'App/Libraries/PushNotification/Index'

export default class Notification extends BaseModel
{
    public static table = 'notifications'

    @column({ isPrimary: true })
    public id: number

    @column()
    public identifier: string

    @column()
    public actor_id: number

    @column()
    public target_id: number

    @column()
    public module: string

    @column()
    public module_id: number

    @column()
    public module_slug: string

    @column()
    public reference_module: string

    @column()
    public reference_id: number

    @column()
    public reference_slug: string

    @column()
    public title: string

    @column()
    public description: string

    @column()
    public web_redirect_link: string

    @column()
    public is_read: string

    @column()
    public is_view: string

    @column.dateTime({ autoCreate: true })
    public created_at: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updated_at: DateTime

    @column()
    public deleted_at: DateTime | null

    @belongsTo(() => User, {
      foreignKey: 'actor_id',
      localKey: 'id'
  })

  public actor: BelongsTo<typeof User>

    public static async getNotificationsByTargetID(target_id: number, request?: any) {
      let params = request.all()
      let query = this.query()

      query = query.where('target_id', target_id)
          .preload('actor')
          .orderBy('created_at', 'desc')
      let record_limit = _.isEmpty(params.limit) ? Config.get("constants.PAGINATION_LIMIT") : parseInt(params.limit);
      query = await query.paginate(_.isEmpty(params.page) ? 1 : params.page, record_limit);
      return query.toJSON();
  }

    public static async saveNotification(notification_data:any)
    {
        //insert notification data into db
        let notification_param:any = [];
        for( var u=0; u < notification_data.target.length; u++ ){
            notification_param.push({
                identifier: notification_data.identifier,
                actor_id: notification_data.actor_id,
                target_id: notification_data.target[u].id,
                module: notification_data.module,
                module_id: notification_data.module_id,
                module_slug: notification_data.module_slug,
                reference_module: _.isEmpty(notification_data.reference_module) ? null : notification_data.reference_module,
                reference_id: _.isEmpty(notification_data.reference_id) ? null : notification_data.reference_id,
                reference_slug: _.isEmpty(notification_data.reference_slug) ? null : notification_data.reference_slug,
                title: notification_data.title,
                description: notification_data.message,
                web_redirect_link: _.isEmpty(notification_data.redirect_link) ? null : notification_data.redirect_link,
                created_at: currentDateTime()
            })
        }
        await this.createMany(notification_param);
        return true;
    }

    /**
     *
     * @param device_tokens
     * @param device_type
     * @param title
     * @param message
     * @param badge
     * @param redirect_link
     * @param custom_data
     */

    public static async sendNotification(identifier: string, notification_data: object, custom_data: object = {}, is_push = true, is_app = true) {
      let ios_device_token = [];
      let android_device_token = [];
      let target_user_id = [];

      let target_users = notification_data.target;
      
      for (var i = 0; i < target_users.length; i++) {
          target_user_id.push(target_users[i].id);
          if (custom_data.message_badge) {
              notification_data.badge = (await this.getCount({ target_id: target_users[i].id, is_badge: 1 })) + 0;
          } else {
              notification_data.badge = (await this.getCount({ target_id: target_users[i].id, is_badge: 1 })) + 1;
          }
          if (!_.isEmpty(target_users[i].device_token)) {
              if (target_users[i].device_type == 'ios') {
                  ios_device_token.push(target_users[i].device_token)
              } else {
                  android_device_token.push(target_users[i].device_token)
              }
          }
      }
      //create unique record
      ios_device_token = _.uniq(ios_device_token);
      android_device_token = _.uniq(android_device_token);
      target_user_id = _.uniq(target_user_id);

      let unique_id = crypto.randomBytes(16).toString("hex");
      custom_data.unique_id = unique_id;

      //send push notification
      if (is_push == true) {
          //send notification on android device
          if (android_device_token.length > 0) {
              PushNotification.notification(
                  android_device_token,
                  'android',
                  notification_data.title,
                  notification_data.message,
                  notification_data.badge,
                  notification_data.redirect_link,
                  custom_data
              );
          }
          //send notification on ios device
          if (ios_device_token.length > 0) {
              PushNotification.notification(
                  ios_device_token,
                  'ios',
                  notification_data.title,
                  notification_data.message,
                  notification_data.badge,
                  notification_data.redirect_link,
                  custom_data
              );
          }
      }
      //insert notification data into db
      let notification_param = [];
      
      return true;
  }

    public static sendPushNotification(
        device_type: string,
        device_tokens: Array<string>,
        title: string,
        message: string,
        badge: number  = 0,
        custom_data: any | null = {}
    )
    {
        let notification_data:any = {
          tokens: device_tokens,
          data:{
            title: title,
            body: message,
            badge:badge,
            custom_data:custom_data
          }
        };
        if( device_type != 'web' ){
          notification_data.notification = {
            title: title,
            body: message,
            badge:badge,
          }
        }
        this.sendPush(notification_data).then();
        return true;
    }

    /**
     *
     * @param notification_data
     */
    private static async sendPush(notification_data: any)
    {
        Admin.messaging().send(notification_data)
        .then((response) => {
          console.log('Notification sent:', response);
        })
        .catch((error) => {
          console.error('Error sending notification:', error);
        });
        return true;
    }

    public static async updateNotification(condition: any, data: any) {
      await this.query().where(condition).update(data);
      let notification = await this.query().where(condition).preload('actor').first();
      return notification
  }
  
  public static async getCount(condition: any) {
    let count = await this.query().where(condition).count('*', 'total')

    let total = count[0]['$extras'].total
    return total
}
}
