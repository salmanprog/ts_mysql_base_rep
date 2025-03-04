import RestController from './RestController'
import { schema,rules } from '@ioc:Adonis/Core/Validator'
import _ from 'lodash'
import I18n from '@ioc:Adonis/Addons/I18n'
import Database from '@ioc:Adonis/Lucid/Database'
import { strSlug, rand, currentDateTime } from 'App/Helpers/Index'
import SeasnoalTaskSelected from 'App/Models/SeasnoalTaskSelected'
import SeasnoalCategory from 'App/Models/SeasnoalCategory'
import SeasnoalTask from 'App/Models/SeasnoalTask'
const moment = require('moment');

export default class SeasnoalCategoryController extends RestController
{
    protected __resource: string;
    protected __request: any;
    protected __response: any;
    protected __params: any;

    constructor() {
        super("SeasnoalCategory");
        this.__resource = "SeasnoalCategory";
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
          title: schema.string({}),
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
          title: schema.string({}),
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

    public async userSelectTask(ctx: HttpContextContract)
    {
        this.__request  = ctx.request;
        this.__response = ctx.response;
        //check validation
        let validationRules = schema.create({
            seasnoal_task_id:schema.string(),
            is_checked:schema.string(),
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
        let user = this.__request.user();
        let current_date = moment().format("MMDDhhss")
        if(params.is_checked == 0){
          let delete_recorde = await SeasnoalTaskSelected.query().where('user_id',user.id).where('seasnoal_task_id',params.seasnoal_task_id).delete();
        }else{
          let slug = await SeasnoalTaskSelected.generateSlug('select_'+rand(111,999)+current_date)
          let delete_recorde = await SeasnoalTaskSelected.query().where('user_id',user.id).where('seasnoal_task_id',params.seasnoal_task_id).delete();
          await Database.table('selected_seasnoal_tasks').insert({
            slug: slug,
            user_id: user.id,
            seasnoal_task_id: params.seasnoal_task_id,
            created_at: currentDateTime()
          })
        }
        
        let record = await SeasnoalTask.getUserTask(params.seasnoal_task_id);
        record.is_checked = parseInt(params.is_checked);
        //send response
        this.__is_paginate = false;
        this.__collection  = false;
        this.__sendResponse(
          200,
          I18n.locale(this.__request.language()).formatMessage('messages.success_store_message'),
          record
        );
        return;
    }
}
