import _ from 'lodash';
import {baseUrl,storageUrl} from 'App/Helpers/Index'

export default class PublicVendor
{

  public static async initResponse(data: any,request:any)
  {
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
        name: record.name,
        username: record.username,
        user_group_id: record.user_group_id,
        slug: record.slug,
        email: record.email,
        image_url: !_.isEmpty(record.image_url) ?  await storageUrl(record.image_url) : baseUrl('/images/user-placeholder.jpg'),
        total_review:record.total_review,
        total_rating:record.total_rating,
      }
  }

}
