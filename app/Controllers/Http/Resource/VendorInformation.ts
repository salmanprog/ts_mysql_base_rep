import _, { get } from 'lodash';
import {baseUrl,storageUrl} from 'App/Helpers/Index'
import VendorCategory from 'App/Models/VendorCategory';

export default class VendorInformation
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
      let get_record = ''
      if(record.service_id != 0){
        let cat_data = await VendorCategory.getCat(record.service_id);
        cat_data = cat_data.toJSON();
        cat_data.identifier = record.identifier
        get_record = cat_data
        //get_record = record.identifier
      }else{
        //record = record.toJSON();
        get_record = record
      }
      
      
      return get_record
  }

}
