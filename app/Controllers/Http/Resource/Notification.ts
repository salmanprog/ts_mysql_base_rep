import _ from 'lodash';
import {baseUrl,storageUrl} from 'App/Helpers/Index'
import PublicUser from './PublicUser';

export default class Notification
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
    let timestamp = new Date(record.created_at).getTime();
    let public_user = await PublicUser.initResponse(record.actor, request);
      return {
          id: record.id,
          unique_id: record.unique_id,
          identifier: record.identifier,
          // actor_id: record.actor_id,
          actor_type: record.actor_type,
          actor: public_user,
          module: record.module,
          module_id: record.module_id,
          reference_module: record.reference_module,
          reference_id: record.reference_id,
          reference_slug: record.reference_slug,
          title: record.title,
          description: record.description,
          web_redirect_link: record.web_redirect_link,
          is_read: record.is_read,
          is_view: record.is_view,
          is_badge: record.is_badge,
          created_at: record.created_at,
          timestamp: timestamp
      }
  }

}
