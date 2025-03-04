import RestController from '../RestController'
import { schema,rules } from '@ioc:Adonis/Core/Validator'
import _ from 'lodash'
import I18n from '@ioc:Adonis/Addons/I18n'
import Property from 'App/Models/Property';
import AdminPropertyCategory from 'App/Models/AdminPropertyCategory';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PropertyCategoryController extends RestController
{
    protected __resource: string;
    protected __request: any;
    protected __response: any;
    protected __params: any;

    constructor() {
        super("AdminPropertyCategory");
        this.__resource = "AdminPropertyCategory";
        this.__request; //adonis request obj
        this.__response; //adonis response obj
        this.__params = {}; // this is used for get parameters from url
        this.__success_store_message = 'messages.success_store_message';
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
            title: schema.string({},[
              rules.minLength(2),
              rules.maxLength(20),
              rules.regex(/^[A-Za-z0-9\s]+$/)
            ])
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
            title: schema.string.optional({},[
              rules.minLength(2),
              rules.maxLength(20),
              rules.regex(/^[A-Za-z0-9\s]+$/)
            ])
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
        let params = this.__params;
        let get_categories = await AdminPropertyCategory.query().where('slug',params.id).first();
        let check = await Property.query().where(function (query) {
                        query.where('property_types',get_categories.id)
                            .orWhere('property_colors',get_categories.id);
                    }).getCount();
        if(check > 0){
          this.__is_error = true;
            return this.sendError(
              I18n.locale(this.__request.language()).formatMessage('messages.validation_msg'),
              { message: I18n.locale(this.__request.language()).formatMessage('messages.cannot_delete'), },
              400
            )
        }                    
    }

    /**
     *
     */
    protected async afterDestoryLoadModel()
    {

    }
}
