'use strict'
import Env from '@ioc:Adonis/Core/Env'
const fetch = require('node-fetch');
const admin = require("firebase-admin");
// const serviceAccount = require("./serviceAccountKey.json");
import * as serviceAccount from './serviceAccountKey.json';

let firebaseAdmin = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
},
  Env.get('APP_NAME')
);

export default class FCM {
  /**
   *
   * @param device_tokens
   * @param device_type
   * @param title
   * @param message
   * @param badge
   * @param redirect_link
   * @param custom_data
   * @returns
   */
  public async sendPush(
    device_tokens: Array<string>,
    device_type: string,
    title: string,
    message: string,
    badge: number = 0,
    redirect_link: string | null = '',
    custom_data: object | null = {}
  ) {
    // if( device_type == 'ios' ){
    //     return this.sendAndroidPushNotification(device_tokens,device_type,title,message,badge,redirect_link,custom_data);
    // } else {
    //     return this.sendAndroidPushNotification(device_tokens,device_type,title,message,badge,redirect_link,custom_data);
    // }
    try {
      let res = await firebaseAdmin.messaging().send({
        token: device_tokens[device_tokens.length - 1],
        notification: {
          title,
          body: message,
        },
        data: {
          custom_data: JSON.stringify(custom_data),
        }
      })
      console.log('<--------res-------->', res);
    } catch (error) {
      console.log('<--------error-------->', error.message);
    }
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
  private sendIosPushNotification(
    device_tokens: Array<string>,
    device_type: string,
    title: string,
    message: string,
    badge: number = 0,
    redirect_link: string | null = '',
    custom_data: object | null = {}
  ) {
    let notification_data = {
      registration_ids: device_tokens,
      notification: {
        title: title,
        text: message,
        body: message,
        sound: 'default',
        badge: badge,
        custom_data: custom_data,
        user_badge: badge,
      }
    }

    console.log('<--------notification_data-------->', notification_data);

    this.sendCurl(notification_data);
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
  private sendAndroidPushNotification(
    device_tokens: Array<string>,
    device_type: string,
    title: string,
    message: string,
    badge: number = 0,
    redirect_link: string | null = '',
    custom_data: object | null = {}
  ) {
    let notification_data = {
      registration_ids: device_tokens,
      notification: {
        title: title,
        body: message,
        sound: 'default',
        badge: badge,
        priority: 'high'
      },
      data: {
        message: {
          title: title,
          body: message,
          sound: 'default'
        },
        user_badge: badge,
        custom_data: custom_data,
        priority: 'high'
      }
    }

    console.log('<--------notification_data-------->', notification_data);

    this.sendCurl(notification_data);
    return true;
  }

  /**
   *
   * @param notification_data
   */
  private sendCurl(notification_data: object) {
    let headers = {
      'Authorization': 'Bearer ' + Env.get('NOTIFICATION_KEY'),
      'Content-Type': 'application/json',
      'charset': 'utf-8'
    }
    fetch(Env.get('NOTIFICATION_URL'), {
      method: 'post',
      body: JSON.stringify(notification_data),
      headers: headers
    })
      .then((res) => {
        res.json().then((resbody) => {
          console.log('FCM Response', resbody);
        })
      })
    return true;
  }
}
module.exports = FCM
