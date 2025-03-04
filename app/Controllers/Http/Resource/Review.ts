import _ from 'lodash';
import PublicUser from './PublicUser';
import PublicVendor from './PublicVendor';

export default class Review
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
          user: await PublicUser.initResponse(record.Sender,request),
          reciever: await PublicVendor.initResponse(record.Reciever,request),
          slug: record.slug,
          description: record.description,
          no_of_rating: record.no_of_rating,
          created_at: record.created_at
      }
  }

}
