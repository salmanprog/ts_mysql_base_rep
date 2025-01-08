import _, { parseInt } from 'lodash';
import {baseUrl,storageUrl} from 'App/Helpers/Index'
import PublicUser from './PublicUser';
import InsightData from './InsightData';
import InsightFavorite from 'App/Models/InsightFavorite'

export default class Insight
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
      let isFavourite = await InsightFavorite.query().where('insight_id',record.id).where('user_id',request.user().id).getCount();
      return {
          id: record.id,
          title: record.title,
          slug: record.slug,
          insight_type: record.insight_type,
          user: !_.isEmpty(record.User) ? await PublicUser.initResponse(record.User,request) : {},
          image_url: !_.isEmpty(record.image_url) ?  await storageUrl(record.image_url) : baseUrl('/images/user-placeholder.jpg'),
          description: record.description,
          list: !_.isEmpty(record.InsightData) ? await InsightData.initResponse(record.InsightData,request) : [],
          is_favourite: parseInt(isFavourite),
          status:record.status,
      }
  }

}
