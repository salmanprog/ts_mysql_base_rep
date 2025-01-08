import _ from 'lodash';
import {baseUrl,storageUrl} from 'App/Helpers/Index'
import PublicUser from './PublicUser';
import PropertyCategory from 'App/Models/PropertyCategory';

export default class Property
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
          name: record.name,
          slug: record.slug,
          user: !_.isEmpty(record.User) ? await PublicUser.initResponse(record.User,request) : {},
          location:{
            country: record.country,
            city: record.city,
            state: record.state,
            zipcode: record.zipcode,
            address: record.address,
            current_location:{
              latitude: parseFloat(record.latitude),
              longitude: parseFloat(record.longitude),
            }
          },
          property_types: _.isEmpty(record.property_types) ? await PropertyCategory.getCategory(record.property_types) : {},
          property_colors: _.isEmpty(record.property_colors) ? await PropertyCategory.getCategory(record.property_colors) : {},
          property_home: _.isEmpty(record.property_home) ? await PropertyCategory.getCategory(record.property_home) : {},
          property_rooms: _.isEmpty(record.property_rooms) ? await PropertyCategory.getCategory(record.property_rooms) : {},
          property_extra_space: _.isEmpty(record.property_extra_space) ? await PropertyCategory.getCategory(record.property_extra_space) : {},
          property_landscape: _.isEmpty(record.property_landscape) ? await PropertyCategory.getCategory(record.property_landscape) : {},
          property_air_conditions: _.isEmpty(record.property_air_conditions) ? await PropertyCategory.getCategory(record.property_air_conditions) : {},
          property_furnace: _.isEmpty(record.property_furnace) ? await PropertyCategory.getCategory(record.property_furnace) : {},
          property_solar_panel: _.isEmpty(record.property_solar_panel) ? await PropertyCategory.getCategory(record.property_solar_panel) : {},
          property_household: _.isEmpty(record.property_household) ? await PropertyCategory.getCategory(record.property_household) : {},
          property_notification: _.isEmpty(record.property_notification) ? await PropertyCategory.getCategory(record.property_notification) : {},
          status:record.status,
      }
  }

}
