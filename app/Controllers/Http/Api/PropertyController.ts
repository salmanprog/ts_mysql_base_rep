import RestController from './RestController'
import { schema,rules } from '@ioc:Adonis/Core/Validator'
import _ from 'lodash'
import I18n from '@ioc:Adonis/Addons/I18n'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PropertyController extends RestController
{
    protected __resource: string;
    protected __request: any;
    protected __response: any;
    protected __params: any;

    constructor() {
        super("Property");
        this.__resource = "Property";
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
            name: schema.string({},[
              rules.minLength(2),
              rules.maxLength(50),
              rules.regex(/^[A-Za-z0-9\s]+$/)
            ]),
            country: schema.string({}),
            city: schema.string({}),
            state: schema.string({}),
            zipcode: schema.string({}),
            address: schema.string({}),
            latitude: schema.string({}),
            longitude: schema.string({}),
            property_types: schema.string({}),
            property_colors: schema.string({}),
            property_home: schema.string({}),
            property_rooms: schema.string({}),
            property_extra_space: schema.string({}),
            property_landscape: schema.string({}),
            property_air_conditions: schema.string({}),
            property_furnace: schema.string({}),
            property_solar_panel: schema.string({}),
            property_household: schema.string({}),
            property_notification: schema.string({}),
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
            country: schema.string({}),
            city: schema.string({}),
            state: schema.string({}),
            zipcode: schema.string({}),
            address: schema.string({}),
            latitude: schema.string({}),
            longitude: schema.string({}),
            property_types: schema.string({}),
            property_colors: schema.string({}),
            property_home: schema.string({}),
            property_rooms: schema.string({}),
            property_extra_space: schema.string({}),
            property_landscape: schema.string({}),
            property_air_conditions: schema.string({}),
            property_furnace: schema.string({}),
            property_solar_panel: schema.string({}),
            property_household: schema.string({}),
            property_notification: schema.string({}),
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

    }

    /**
     *
     */
    protected async afterDestoryLoadModel()
    {

    }
}
