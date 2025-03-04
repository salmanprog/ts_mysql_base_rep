import RestController from '../RestController'
import { schema,rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Hash from '@ioc:Adonis/Core/Hash'
import User from 'App/Models/User';
import UserApiToken from 'App/Models/UserApiToken';
import ResetPassword from 'App/Models/ResetPassword';
import _ from 'lodash'
import Env from '@ioc:Adonis/Core/Env'
import I18n from '@ioc:Adonis/Addons/I18n'
import UserDeviceToken from 'App/Models/UserDeviceToken';

export default class AuthController extends RestController
{
    protected __resource: string;
    protected __request: any;
    protected __response: any;
    protected __params: any;

    constructor() {
        super("Admin");
        this.__resource = "AdminAuth";
        this.__request; //adonis request obj
        this.__response; //adonis response obj
        this.__params = {}; // this is used for get parameters from url
        this.__success_store_message = 'messages.account_created';
    }

    /**
     *
     * @param action
     * @param slug
     */
    protected async validation( action: string, slug: string )
    {
        switch (action) {
          case "store":
            await this.storeValidation();
          break;
          case "update":
            await this.updateValidation();
          break;
        }
    }

    /**
     *
     * @returns
     */
    private async storeValidation()
    {
        let validator:any;
        let validationRules:any;

        validationRules = schema.create({
        })
        try{
          validator = await this.__request.validate({ schema: validationRules,messages: {
          }
          })
        } catch(error){
            this.__is_error = true;
            return this.sendError(
              'Validation Message', //validation_msg
               this.setValidatorMessagesResponse(error.messages),
               400
            )
        }
        return validator;
    }


    /**
     *
     * @returns
     */
    private async updateValidation()
    {
        let validator: any;
        let validationRules: any;

        validationRules = schema.create({
        })
        try{
          validator = await this.__validate({ schema: validationRules })
        } catch(error){
            this.__is_error = true;
            return this.sendError(
              I18n.locale(this.__request.language()).formatMessage('messages.validation_msg'),
              this.setValidatorMessagesResponse(error.messages),
              400
            )
        }
        return validator;
    }

    /**
     *
     */
    protected async beforeIndexLoadModel()
    {

    }

    /**
     *
     */
    protected async afterIndexLoadModel(records:any)
    {

    }

    /**
     *
     */
    protected async beforeStoreLoadModel()
    {
        
    }

    /**
     *
     */
    protected async afterStoreLoadModel()
    {

    }

    /**
     *
     */
    protected async beforeShowLoadModel()
    {
        
    }

    /**
     *
     */
    protected async afterShowLoadModel(record: object)
    {

    }

    /**
     *
     */
    protected async beforeUpdateLoadModel()
    {
        let user = this.__request.user();
        if( user.slug != this.__params.id ){
            this.__is_error = true;
            return this.sendError(
              I18n.locale(this.__request.language()).formatMessage('messages.validation_msg'),
              { message: I18n.locale(this.__request.language()).formatMessage('messages.invalid_request'), },
              400
            )
        }
    }

    /**
     *
     */
    protected async afterUpdateLoadModel()
    {

    }

    /**
     *
     */
    protected async beforeDestoryLoadModel()
    {

    }

    /**
     *
     */
    protected async afterDestoryLoadModel()
    {

    }

    public async login(ctx: HttpContextContract)
    {
        this.__request  = ctx.request;
        this.__response = ctx.response;
        //check validation
        let validationRules = schema.create({
            email: schema.string({},[
              rules.email(),
            ]),
            password: schema.string(),
            device_type: schema.enum.optional(['ios','android','web']),
            device_token: schema.string.optional({})
        })
        try{
           await this.__validate({ schema: validationRules })
        } catch(error){
            return this.sendError(
              I18n.locale(this.__request.language()).formatMessage('messages.validation_msg'),
              this.setValidatorMessagesResponse(error.messages),
              400
            )
        }
        //get user by email
        let body_params = this.__request.all();
        let user:any = await User.adminAuth(body_params.email);
         
        if( _.isEmpty(user) ){
            return this.sendError(
              I18n.locale(this.__request.language()).formatMessage('messages.validation_msg'),
              {message: I18n.locale(this.__request.language()).formatMessage('messages.invalid_user')},
              400
            );
        }
        if (! await Hash.verify(user.password, body_params.password)) {
            return this.sendError(
                I18n.locale(this.__request.language()).formatMessage('messages.validation_msg'),
                {message:I18n.locale(this.__request.language()).formatMessage('messages.invalid_user')},
                400
            );
        }
        if( user.status != 1 ){
            return this.sendError(
              I18n.locale(this.__request.language()).formatMessage('messages.validation_msg'),
              {message:I18n.locale(this.__request.language()).formatMessage('messages.account_disabled')},
              400
            );
        }
        if( user.is_email_verify != 1 && Env.get('MAIL_SANDBOX') == 0 ){
            return this.sendError(
              I18n.locale(this.__request.language()).formatMessage('messages.validation_msg'),
              {message:I18n.locale(this.__request.language()).formatMessage('messages.unverified_email')},
              400
            );
        }
        //update api token
        let api_token = await UserApiToken.createApiToken(this.__request,user);
        //save device token
        UserDeviceToken.getOrCreate(user.id,body_params.device_type,body_params.device_token);

        user.userApiToken = api_token;
        //send response

        this.__is_paginate = false;
        await this.__sendResponse(
                  200,
                  I18n.locale(this.__request.language()).formatMessage('messages.login_success'),
                  user
              );
        return;
    }

    public async forgotPassword(ctx: HttpContextContract)
    {
        this.__request  = ctx.request;
        this.__response = ctx.response;
        //check validation
        let validationRules = schema.create({
            email: schema.string({},[
              rules.email(),
            ]),
        })
        try{
          await this.__validate({ schema: validationRules })
        } catch(error){
            this.__is_error = true;
            return this.sendError(
              I18n.locale(this.__request.language()).formatMessage('messages.validation_msg'),
              this.setValidatorMessagesResponse(error.messages),
              400
            )
        }
        let body_params = this.__request.all();
        let user = await User.getUserByEmail(body_params.email);
        if( _.isEmpty(user) ){
          return  this.sendError(
                    I18n.locale(this.__request.language()).formatMessage('messages.validation_msg'),
                    {message:I18n.locale(this.__request.language()).formatMessage('messages.email_not_exist')},
                    400
                  );
        }
        if( user.is_email_verify != 1 && Env.get('MAIL_SANDBOX') == 0 ){
          return this.sendError(
                    I18n.locale(this.__request.language()).formatMessage('messages.validation_msg'),
                    {message:I18n.locale(this.__request.language()).formatMessage('messages.email_not_exist')},
                    400
                  );
        }
        if( user.status != 1 ){
          return this.sendError(
                    I18n.locale(this.__request.language()).formatMessage('messages.validation_msg'),
                    {message:I18n.locale(this.__request.language()).formatMessage('messages.account_disabled')},
                    400
                  );
        }

        ResetPassword.forgotPassword(user).then( () => {} );
        //send response
        this.__is_paginate = false;
        this.__sendResponse(
          200,
          I18n.locale(this.__request.language()).formatMessage('messages.forgot_pass_msg'),
          {}
        );
        return;
    }

    public async changePassword(ctx: HttpContextContract)
    {
        this.__request  = ctx.request;
        this.__response = ctx.response;
        //check validation
        let validationRules = schema.create({
            current_password: schema.string(),
            new_password: schema.string({},[
              rules.minLength(8),
              rules.maxLength(100),
              rules.regex(/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,100}$/)
            ]),
            confirm_password: schema.string({},[
              rules.confirmed('new_password')
            ])
        })
        try{
          await this.__validate({ schema: validationRules })
        } catch(error){
            return this.sendError(
              I18n.locale(this.__request.language()).formatMessage('messages.validation_msg'),
              this.setValidatorMessagesResponse(error.messages),
              400
            )
        }
        let user        = this.__request.user();
        let body_params = this.__request.all();
        if (! await Hash.verify(user.password, body_params.current_password)) {
            return this.sendError(
              I18n.locale(this.__request.language()).formatMessage('messages.validation_msg'),
              {message: I18n.locale(this.__request.language()).formatMessage('messages.current_password_invalid')},
              400
            )
        } else if(body_params.new_password == body_params.current_password){
            return this.sendError(
              I18n.locale(this.__request.language()).formatMessage('messages.validation_msg'),
              {message: I18n.locale(this.__request.language()).formatMessage('messages.new_password_different')},
              400
            )
        } else {
            let newPassword = await Hash.make(body_params.new_password)
            await User.updateUser({password:newPassword},{id:user.id});
            //delete api token except current token
            UserApiToken.deleteApiTokenExceptCurrentToken(user.id,this.__request.apiToken()).then()
            //send response
            this.__is_paginate = false;
            this.__collection  = false;

            this.__sendResponse(
              200,
              I18n.locale(this.__request.language()).formatMessage('messages.update_password_msg'),
              []
            );
            return;
        }
    }

    public async resetPassword(ctx: HttpContextContract)
    {
      //console.log("here");return
        this.__request  = ctx.request;
        this.__response = ctx.response;
        //check validation
        let validationRules = schema.create({
          password: schema.string({},[
              rules.minLength(8),
              rules.maxLength(100),
              rules.regex(/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,100}$/)
            ]),
            confirm_password: schema.string({},[
              rules.confirmed('password')
            ])
        })
        try{
          await this.__validate({ schema: validationRules })
        } catch(error){
            return this.sendError(
              I18n.locale(this.__request.language()).formatMessage('messages.validation_msg'),
              this.setValidatorMessagesResponse(error.messages),
              400
            )
        }

        let user        = this.__request.user();
        let body_params = this.__request.all();

        let newPassword = await Hash.make(body_params.password)
        await User.updateUser({password:newPassword},{id:user.id});
        //delete api token except current token
        UserApiToken.deleteApiTokenExceptCurrentToken(user.id,this.__request.apiToken()).then()
        //send response
        this.__is_paginate = false;
        this.__collection  = false;

        this.__sendResponse(
          200,
          I18n.locale(this.__request.language()).formatMessage('messages.update_password_msg'),
          []
        );
        return;

    }

    public async userLogout(ctx: HttpContextContract)
    {
        this.__request  = ctx.request;
        this.__response = ctx.response;
        //check validation
        let validationRules = schema.create({
            device_type:schema.enum(['android','ios','web']),
            device_token:schema.string(),
        })
        try{
          await this.__validate({ schema: validationRules })
        } catch(error){
            return this.sendError(
              I18n.locale(this.__request.language()).formatMessage('messages.validation_msg'),
              this.setValidatorMessagesResponse(error.messages),
              400
            )
        }
        await User.removeDeviceToken(this.__request);
        //send response
        this.__is_paginate = false;

        this.__sendResponse(
          200,
          I18n.locale(this.__request.language()).formatMessage('messages.logout_msg'),
          []
        );
        return;
    }
}
