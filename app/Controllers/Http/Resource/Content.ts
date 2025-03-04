import _, { parseInt } from 'lodash';
import {baseUrl,storageUrl} from 'App/Helpers/Index'

export default class Content
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
        content: record.content,
        created_at: record.created_at
      }
  }

}
