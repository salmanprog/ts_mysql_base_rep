import _ from 'lodash';
import {baseUrl,storageUrl} from 'App/Helpers/Index'
import VendorInformation from './VendorInformation';
import VendorCategory from 'App/Models/VendorCategory';
import ChatGroup from 'App/Models/ChatGroup';
import ResChatGroup from './ChatGroup';
import LoginChatGroup from './LoginChatGroup';
import Review from 'App/Models/Review';
import ResReview from './Review';
import ProfileVisit from 'App/Models/ProfileVisit';
import Subscription from './Subscription';

export default class AdminVendor
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
      let vendor_info = {}
      if(!_.isEmpty(record.VendorInformation)){
            let sub_cat_ids = []
            let sub_cat = []
            let available_day = []
            let available_hours = []
            let availableDay = []
            let availableHours = []
            for(let i=0;i<record.VendorInformation.length;i++){
              if(record.VendorInformation[i].identifier == 'service_parent_id'){
                let cat_data = await VendorCategory.getCat(record.VendorInformation[i].service_id);
                    cat_data = cat_data.toJSON();
                vendor_info.category = cat_data
              }
              if(record.VendorInformation[i].identifier == 'sub_services'){
                sub_cat_ids.push(record.VendorInformation[i].service_id)
              }
              if(record.VendorInformation[i].identifier == 'service_area'){
                vendor_info.service_area = record.VendorInformation[i].txt_field
              }
              if(record.VendorInformation[i].identifier == 'available_hours'){
                available_hours.push(record.VendorInformation[i].service_id)
                // let available_hours = await VendorCategory.getCat(record.VendorInformation[i].service_id);
                // available_hours = available_hours.toJSON();
                // vendor_info.available_hours = available_hours.title
              }
              if(record.VendorInformation[i].identifier == 'available_day'){
                available_day.push(record.VendorInformation[i].service_id)
                // let available_day = await VendorCategory.getCat(record.VendorInformation[i].service_id);
                // available_day = available_day.toJSON();
                // vendor_info.available_day = available_day.title
              }
              if(record.VendorInformation[i].identifier == 'per_hour_rate'){
                vendor_info.per_hour_rate = record.VendorInformation[i].txt_field
              }
              if(record.VendorInformation[i].identifier == 'experience_in_number'){
                vendor_info.experience_in_number = record.VendorInformation[i].txt_field
              }
              if(record.VendorInformation[i].identifier == 'experience_in_text'){
                vendor_info.experience_in_text = record.VendorInformation[i].txt_field
              }
              if(record.VendorInformation[i].identifier == 'emergency_hour'){
                let emergency_hour = await VendorCategory.getCat(record.VendorInformation[i].service_id);
                emergency_hour = emergency_hour.toJSON();
                vendor_info.emergency_hour = emergency_hour.title
              }
              if(record.VendorInformation[i].identifier == 'description'){
                vendor_info.description = record.VendorInformation[i].txt_field
              }
              if(record.VendorInformation[i].identifier == 'is_notification'){
                let is_notification = await VendorCategory.getCat(record.VendorInformation[i].service_id);
                is_notification = is_notification.toJSON();
                vendor_info.is_notification = is_notification.title
              }
              
            }
            if(!_.isEmpty(sub_cat_ids)){
              for(let j=0;j<sub_cat_ids.length;j++){
                let sub_cat_data = await VendorCategory.getCat(sub_cat_ids[j]);
                sub_cat_data = sub_cat_data.toJSON();
                sub_cat.push(sub_cat_data)
              }
            }
            if(!_.isEmpty(available_day)){
              for(let a=0;a<available_day.length;a++){
                let sub_day_data = await VendorCategory.getCat(available_day[a]);
                sub_day_data = sub_day_data.toJSON();
                availableDay.push(sub_day_data)
              }
            }
            if(!_.isEmpty(available_hours)){
              for(let b=0;b<available_hours.length;b++){
                let sub_hours_data = await VendorCategory.getCat(available_hours[b]);
                sub_hours_data = sub_hours_data.toJSON();
                availableHours.push(sub_hours_data)
              }
            }
            vendor_info.category.sub_category = sub_cat
            vendor_info.available_day = availableDay
            vendor_info.available_hours = availableHours
      }
      let lst_message = await ChatGroup.getRecentChat(record.id);
      request.all().user_id = record.id
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
          transaction_id:record.transaction_id,
          gateway_type:record.gateway_type,
          is_subscription:parseInt(record.is_subscription),
          subscription:!_.isEmpty(record.Subscription) ? await Subscription.initResponse(record.Subscription,request) : {},
          subscription_start_date:record.subscription_start_date,
          subscription_end_date:record.subscription_end_date,
          last_review: await ResReview.initResponse(await Review.recentReview(record.id),request),
          review: await ResReview.initResponse(await Review.allReview(record.id),request),
          is_mobile_verify:record.is_mobile_verify,
          is_email_verify:record.is_email_verify,
          platform_type:record.platform_type,
          vendor_info:vendor_info,
          total_review:record.total_review,
          total_rating:record.total_rating,
          total_visit:record.total_visit,
          is_online:record.online_status,
          visit_data: await ProfileVisit.getVisitor(record.id),
          status:record.status,
          created_at: record.created_at
      }
  }

}
