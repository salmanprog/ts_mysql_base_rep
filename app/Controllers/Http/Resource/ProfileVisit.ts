import _ from 'lodash';
import {baseUrl,storageUrl} from 'App/Helpers/Index'
import PublicUser from './PublicUser';
import User from 'App/Models/User';

export default class ProfileVisit
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
     let user_obj = ''
     if(request.user().id == record.actor_id){
        user_obj = record.Target
     }else{
        user_obj = record.Actor
     } 
     return {
          id: record.id,
          actor_id: record.actor_id,
          target_id: record.target_id,
          month: record.month,
          slug: record.slug,
          year: record.year,
          visit_date: record.visit_date,
          user:  await PublicUser.initResponse(user_obj,request),
          status:record.status,
          created_at: record.created_at
      }
  }

}
