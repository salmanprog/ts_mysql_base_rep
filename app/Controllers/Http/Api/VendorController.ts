import RestController from './RestController'
import { schema,rules } from '@ioc:Adonis/Core/Validator'
import _ from 'lodash'
import I18n from '@ioc:Adonis/Addons/I18n'

export default class VendorController extends RestController
{
    protected __resource: string;
    protected __request: any;
    protected __response: any;
    protected __params: any;

    constructor() {
        super("Vendor");
        this.__resource = "Vendor";
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
            name: schema.string({},[
              rules.minLength(2),
              rules.maxLength(20),
              rules.regex(/^[A-Za-z0-9\s]+$/)
            ]),
            email: schema.string({},[
                rules.email(),
                rules.maxLength(50),
                rules.unique({
                  table: 'users',
                  column: 'email',
                  where: {
                    deleted_at: null,
                  },
                })
            ]),
            password: schema.string({},[
                rules.minLength(8),
                rules.maxLength(100),
                rules.regex(/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,100}$/),
                rules.confirmed('confirm_password')
            ]),
            user_group_id: schema.string({}),
            confirm_password: schema.string({}),
            device_type: schema.enum(['ios','android','web']),
            device_token: schema.string.optional({})
        })
        try{
          validator = await this.__validate({ schema: validationRules })
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
            name: schema.string.optional({},[
              rules.minLength(2),
              rules.maxLength(20),
              rules.regex(/^[A-Za-z0-9\s]+$/)
            ]),
            mobile_no: schema.string.optional({},[
              rules.minLength(10),
              rules.maxLength(15),
              rules.regex(/^\+1-\d{3}-\d{3}-\d{4}$/),
              rules.unique({
                table: 'users',
                column: 'mobile_no',
                where: {
                  deleted_at: null
                },
                whereNot:{
                  slug: this.__params.id
                }
              })
          ]),
            image_url: schema.file.optional({
              size: '2mb',
              extnames: ['jpg', 'gif', 'png'],
            }),
            device_type: schema.enum.optional(['ios','android','web']),
            device_token: schema.string.optional()
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

        //twillio
        // if( Env.get('OTP_SENDBOX') == 0 ){
        //     let twillio_response = await Twillio.sendOtp(this.__request.input('mobile_no'));
        //     if( twillio_response.code != 200 ){
        //       this.__is_error = true;
        //       return  this.sendError('SMS gateway Error',{message:twillio_response.message},400);
        //     }
        // }

        //telesign
        // if( Env.get('OTP_SENDBOX') == 0 ){
        //     let otp_code = rand(1111,9999);
        //     Request.macro('otpCode', function () {
        //       return otp_code;
        //     });
        //     let telesignResponse = await Telesign.sendOtp(this.__request.input('mobile_no'),otp_code);
        //     if( telesignResponse.code != 200 ){
        //         this.__is_error = true;
        //         return  this.sendError('SMS gateway Error',{message:telesignResponse.message},400);
        //     }
        // }
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
        let user = this.__request.user();
        if( user.slug != this.__params.id ){
          this.__resource = 'Vendor';
        }
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
}
