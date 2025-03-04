import _ from 'lodash';
import {baseUrl,storageUrl} from 'App/Helpers/Index'
import SeasnoalTask from './SeasnoalTask';

export default class SeasnoalCategory
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
     let req = request.all();
     req.current_user_id = request.user().id 
     return {
          id: record.id,
          title: record.title,
          slug: record.slug,
          tasks: await SeasnoalTask.initResponse(record.SeasnoalTask,request),
      }
  }

}
