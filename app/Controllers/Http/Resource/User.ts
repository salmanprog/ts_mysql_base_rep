import _ from 'lodash';
import {baseUrl,storageUrl} from 'App/Helpers/Index'
import Subscription from './Subscription';
import Property from './Property';
import MdlProperty from 'App/Models/Property';
import InsightFavorite from 'App/Models/InsightFavorite';
import Insight from './Insight';

export default class User
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
      let api_token = typeof request.headers().authorization == 'undefined' ? record.userApiToken.api_token : request.apiToken();
      api_token = Buffer.from(api_token, "utf8").toString("base64")
      return {
          id: record.id,
          name: record.name,
          username: record.username,
          user_group_id: record.user_group_id,
          slug: record.slug,
          email: record.email,
          mobile_no: record.mobile_no,
          gender: record.gender,
          dob: record.dob,
          image_url: !_.isEmpty(record.image_url) ?  await storageUrl(record.image_url) : baseUrl('/images/user-placeholder.jpg'),
          is_mobile_verify:record.is_mobile_verify,
          is_email_verify:record.is_email_verify,
          platform_type:record.platform_type,
          is_socket:record.is_socket,
          transaction_id:record.transaction_id,
          gateway_type:record.gateway_type,
          is_subscription:parseInt(record.is_subscription),
          subscription:!_.isEmpty(record.Subscription) ? await Subscription.initResponse(record.Subscription,request) : {},
          subscription_start_date:record.subscription_start_date,
          subscription_end_date:record.subscription_end_date,
          total_property: await MdlProperty.getTotalProperty(record.id),
          property:!_.isEmpty(record.Property) ? await Property.initResponse(record.Property,request) : [],
          insight_favourite: await Insight.initResponse(await InsightFavorite.getFavouritInsight(record.id),request),
          total_property_task:record.total_property_task,
          total_property_task_complete:record.total_property_task_complete,
          total_property_task_pending:record.total_property_task_pending,
          status:record.status,
          api_token: api_token,
          created_at: record.created_at
      }
  }

}
