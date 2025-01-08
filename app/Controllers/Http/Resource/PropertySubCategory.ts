import _ from 'lodash';
import {baseUrl,storageUrl} from 'App/Helpers/Index'
import MdlPropertyCategory from 'App/Models/PropertyCategory';
import Property from 'App/Models/Property';


export default class PropertySubCategory
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
    let params = request.all()
    let property_id = !_.isEmpty(params.id) ? params.id : 0;
    
      return {
          id: record.id,
          title: record.title,
          slug: record.slug,
          is_select: !_.isEmpty(params.id) ? await Property.checkCategory(params.id,record.id,params.property_slug) : 0,
          status:record.status,
      }
  }

}
