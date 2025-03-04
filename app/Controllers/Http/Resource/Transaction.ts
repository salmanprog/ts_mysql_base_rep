import _ from 'lodash';
import {baseUrl,storageUrl} from 'App/Helpers/Index'
import PublicUser from './PublicUser';

export default class Transaction
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
          slug: record.slug,
          user_id: record.user_id,
          transaction_id: record.transaction_id,
          gateway_type: record.gateway_type,
          subscription_id: record.subscription_id,
          subscription_title: record.subscription_title,
          subscription_amount: record.subscription_amount,
          subscription_start_date: record.subscription_start_date,
          subscription_end_date: record.subscription_end_date,
          user: !_.isEmpty(record.User) ? await PublicUser.initResponse(record.User,request) : {},
      }
  }

}
