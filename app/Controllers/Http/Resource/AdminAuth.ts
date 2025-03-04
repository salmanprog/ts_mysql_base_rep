import _ from 'lodash';
import {baseUrl,storageUrl} from 'App/Helpers/Index'

export default class AdminAuth
{
  headers: {};
  static headers: any;

  constructor()
  {
      this.headers = {};
  }

  protected static async initResponse(data: any,request:any)
  {
      //this.headers = request.headers();
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
      
    let api_token = typeof request.headers().authorization == 'undefined' ? record.userApiToken.api_token : request.apiToken();
    api_token = Buffer.from(api_token, "utf8").toString("base64")
    return {
        id: record.id,
        parent_id:record.parent_id,
        user_group_id:record.user_group_id,
        name: record.name,
        username: record.username,
        slug: record.slug,
        email: record.email,
        mobile_no: record.mobile_number,
        image_url: !_.isEmpty(record.image_url) ?  await storageUrl(record.image_url) : baseUrl('/images/user-placeholder.jpg'),
        company_name:record.company_name,
        company_address:record.company_address,
        company_mobile_number:record.company_mobile_number,
        company_email_address:record.company_email_address,
        is_mobile_verify:record.is_mobile_verify,
        is_email_verify:record.is_email_verify,
        platform_type:record.platform_type,
        status:record.status,
        api_token: api_token,
        created_at: record.created_at
    }
  }

}
