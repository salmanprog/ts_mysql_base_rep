import { column,hasOne,HasOne,hasMany,HasMany } from '@ioc:Adonis/Lucid/Orm'
import { string } from '@ioc:Adonis/Core/Helpers'
import Database from '@ioc:Adonis/Lucid/Database'
import Config from '@ioc:Adonis/Core/Config'
import Hash from '@ioc:Adonis/Core/Hash'
import { strSlug, rand, currentDateTime } from 'App/Helpers/Index'
import _ from 'lodash'
import { DateTime } from 'luxon'
import jwt from 'jsonwebtoken'
import RestModel from './RestModel'
import UserApiToken from 'App/Models/UserApiToken'
import Property from 'App/Models/Property'
import UserDeviceToken from './UserDeviceToken'
import Subscription from './Subscription'

enum UserType{
  'admin',
  'user',
  'vendor',
}
enum GenderType{
    'male',
    'female',
  }
export default class Admin extends RestModel
{
    public static table = 'users'

    @column({ isPrimary: true })
    public id: number

    @column()
    public user_group_id: number

    @column()
    public user_type: UserType

    @column()
    public name: string

    @column()
    public username: string

    @column()
    public slug: string

    @column()
    public email: string

    @column()
    public mobile_no: string

    @column()
    public gender: GenderType

    @column()
    public dob: string

    @column({ serializeAs: null })
    public password: string

    @column()
    public image_url: string | null

    @column()
    public blur_image: string | null

    @column()
    public status: number

    @column()
    public is_email_verify: number

    @column()
    public email_verify_at: DateTime | null

    @column()
    public is_mobile_verify: number

    @column()
    public mobile_verify_at: DateTime | null

    @column()
    public online_status: number | null

    @column()
    public mobile_otp: string | null

    @column()
    public mobile_otp_created_at: DateTime | null

    @column()
    public email_otp: string | null

    @column()
    public email_otp_created_at: DateTime | null

    @column()
    public is_subscription: number

    @column()
    public is_socket: number

    @column()
    public transaction_id: string

    @column()
    public gateway_type: string

    @column()
    public subscripton_id: number

    @column()
    public subscription_title: string

    @column()
    public subscription_amount: number

    @column()
    public subscription_start_date: string | null

    @column()
    public subscription_end_date: string | null

    @column.dateTime({ autoCreate: true })
    public created_at: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updated_at: DateTime

    @column()
    public deleted_at: DateTime | null

    @column()
    public device_type: string | null

    @column()
    public device_token: string | null

    @column()
    public platform_type: string | null

    @column()
    public platform_id: string | null

    @column()
    public total_property: number
    
    @column()
    public total_property_task: number

    @column()
    public total_property_task_complete: number

    @column()
    public total_property_task_pending: number

    @column()
    public total_review: number

    @column()
    public total_visit: number

    @column()
    public total_rating: string

    @hasOne(() => UserApiToken, {
      foreignKey: 'user_id',
      localKey: 'id'
    })
    public userApiToken: HasOne<typeof UserApiToken>

    @hasOne(() => Subscription, {
        foreignKey: 'id',
        localKey: 'subscripton_id'
      })
      public Subscription: HasOne<typeof Subscription>

    @hasMany(() => Property, {
    foreignKey: 'user_id',
    localKey: 'id'
    })
    public Property: HasMany<typeof Property>  

    @hasMany(() => UserDeviceToken, {
      foreignKey: 'user_id',
      localKey: 'id'
    })
    public UserDeviceToken: HasMany<typeof UserDeviceToken>

    public static fillable()
    {
        return [
          'user_group_id','user_type','name','username','slug','about_us','email','mobile_no','gender','dob','password','image_url',
          'blur_image','is_mobile_verify','mobile_verify_at','is_email_verify','email_verify_at','status','platform_type',
          'country','city','state','zipcode','address','latitude','longitude','online_status','mobile_otp','platform_id',
          'email_otp','mobile_otp_created_at','email_otp_created_at','is_subscription','is_socket','transaction_id','gateway_type','subscripton_id','subscription_title','subscription_amount','subscription_start_date','subscription_end_date','total_property','total_property_task','total_property_task_complete','total_property_task_pending','total_review','total_visit','total_rating','created_at','updated_at','deleted_at'
        ]
    }

    public static async adminAuth(email:string)
    {
        let record = await this.query()
                              .where('email',email)
                              .where('user_type','admin')
                              .first();
        return record;
    }

    public static generateApiToken(user:object)
    {
        let jwt_options = {
            algorithm: 'HS256',
            expiresIn:Config.get('constants.JWT_EXPIRY'),
            issuer: Config.get('constants.CLIENT_ID'),
            subject: Config.get('constants.CLIENT_ID'),
            jwtid: user.email,
        }
        let user_data = JSON.stringify(user);
        var token = jwt.sign({user:user}, Config.get('constants.JWT_SECRET'), jwt_options);
        return token;
    }

    public static async generateSlug(name:string)
    {
        let slug = strSlug(name);
        let query = await this.query().where('slug',slug).count('id as total');
        return query[0].$extras.total == 0 ? slug : slug + query[0].$extras.total + rand(111,999);
    }

    public static async getUserByEmail(email:string)
    {
        let record = await this.query().where('email',email).whereNull('deleted_at').first();
        return record;
    }

    public static async getUserBySlug(slug) {
        let query = await this.query().where('users.slug', slug).whereNull('deleted_at').first()
        return query;
    }

    public static async updateUser(data:any,condition:any)
    {
      await this.query().where(condition).update(data);
      return true
    }

    public static async updateResetPassword(params:any)
    {
        let new_password = await Hash.make(params.new_password)
        await Database.query().from('users').where('email',params.email).update({
            password: new_password
        })
        await Database.query().from('reset_passwords').where('email',params.email).delete();
        return true;
    }

    public static async getUserByApiToken(api_token:string)
    {
        let query = this.query()
                        .select('users.*')
                        .innerJoin('user_api_tokens AS uat','uat.user_id','=','users.id')
                        .where('api_token',api_token)
                        .first()
        return query;
    }


    public static async removeDeviceToken(request:any)
    {
        let params = request.all();
        let user   = request.user();
        await UserDeviceToken.query()
                          .where('user_id',user.id)
                          .where('device_type',params.device_type)
                          .where('device_token',params.device_token)
                          .delete();
        return true;
    }

    public static async getUserDeviceTokensByID(user_ids:Array<number>)
    {
        let query = await this.query()
                            .preload('UserDeviceToken')
                            .select('users.*')
                            .whereIn('users.id',user_ids)
                            .where('users.status','1');
        return query;
    }
}
