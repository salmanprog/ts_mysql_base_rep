import _ from 'lodash';
import {baseUrl,storageUrl} from 'App/Helpers/Index'
import PublicUser from './PublicUser';
import User from 'App/Models/User';
import SeasnoalTaskSelected from 'App/Models/SeasnoalTaskSelected'
export default class SeasnoalTask
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
          category_id: record.category_id,
          title: record.title,
          slug: record.slug,
          task_date: record.task_date,
          task_time: record.task_time,
          is_checked: await SeasnoalTaskSelected.userSelected(request.user().id,record.id),
          status:record.status,
          created_at: record.created_at
      }
  }

}
