import RestController from './RestController'
import { schema,rules } from '@ioc:Adonis/Core/Validator'
import _ from 'lodash'
import I18n from '@ioc:Adonis/Addons/I18n'
import InsightFavorite from 'App/Models/InsightFavorite';

export default class InsightFavoriteController extends RestController
{
    protected __resource: string;
    protected __request: any;
    protected __response: any;
    protected __params: any;

    constructor() {
        super("InsightFavorite");
        this.__resource = "InsightFavorite";
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
          insight_id: schema.string({}),
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
          insight_id: schema.string({}),
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
      let user = this.__request.user();
      let params = this.__request.all();
      let check_record = await InsightFavorite.query().where('insight_id',params.insight_id).where('user_id',user.id).first();
      
      if(!_.isEmpty(check_record)){
        this.__is_error = true;
        return this.sendError(
          I18n.locale(this.__request.language()).formatMessage('messages.validation_msg'),
          { message: I18n.locale(this.__request.language()).formatMessage('messages.favourite_item_exist'), },
          400
        )
      }
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

    public async deleteFavouriteItem(ctx: HttpContextContract)
    {
        this.__request  = ctx.request;
        this.__response = ctx.response;
        //check validation
        let validationRules = schema.create({
          insight_id:schema.string(),
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
        let params = this.__request.all();
        await InsightFavorite.favouriteItemDelete(params.insight_id,this.__request.user().id);
        //send response
        this.__is_paginate = false;

        this.__sendResponse(
          200,
          I18n.locale(this.__request.language()).formatMessage('messages.success_delete_message'),
          []
        );
        return;
    }
}
