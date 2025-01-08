import _ from 'lodash';
import {baseUrl,storageUrl} from 'App/Helpers/Index'
import PublicUser from './PublicUser';
import Property from './Property';

export default class PropertyTask
{
  headers: {};
  static headers: any;

  constructor()
  {
      this.headers = {};
  }

  protected static async initResponse(data: any,request:any)
  {
      this.headers = request.headers();
      if( _.isEmpty(data) )
        return [];

      let response:any;
      if( Array.isArray(data) ){
        response = []
        for(var i=0; i < data.length; i++)
        {
          response.push( await this.jsonSchema(data[i],request));
        }
      } else {
        response = await this.jsonSchema(data,request)
      }
      return response;
  }

  private static async jsonSchema(record: any,request:any)
  {
      return {
          id: record.id,
          title: record.title,
          slug: record.slug,
          description: record.description,
          task_date: record.task_date,
          task_time: record.task_time,
          notification_send_by: record.notification_send_by,
          task_notification_date: record.task_notification_date,
          task_notification_time: record.task_notification_time,
          is_notify: record.is_notify,
          task_status: record.task_status,
          user: !_.isEmpty(record.User) ? await PublicUser.initResponse(record.User,request) : {},
          property: !_.isEmpty(record.Property) ? await Property.initResponse(record.Property,request) : {},
          status:record.status,
      }
  }

}
