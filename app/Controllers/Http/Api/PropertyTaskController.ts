import RestController from './RestController'
import { schema,rules } from '@ioc:Adonis/Core/Validator'
import _ from 'lodash'
import I18n from '@ioc:Adonis/Addons/I18n'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { json } from 'stream/consumers'
import PropertyTask from 'App/Models/PropertyTask'
import Database from '@ioc:Adonis/Lucid/Database'

export default class PropertyTaskController extends RestController
{
    protected __resource: string;
    protected __request: any;
    protected __response: any;
    protected __params: any;

    constructor() {
        super("PropertyTask");
        this.__resource = "PropertyTask";
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
              rules.maxLength(50),
              rules.regex(/^[A-Za-z0-9\s]+$/)
            ]),
            property_id: schema.string({}),
            task_date: schema.string({}),
            task_time: schema.string({}),
            notification_send_by: schema.string({}),
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
          title: schema.string({},[
            rules.minLength(2),
            rules.maxLength(50),
            rules.regex(/^[A-Za-z0-9\s]+$/)
          ]),
          property_id: schema.string({}),
          task_date: schema.string({}),
          task_time: schema.string({}),
          notification_send_by: schema.string({}),
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

    public async propetyTaskDelete(ctx: HttpContextContract)
    {
      //console.log("here");return
        this.__request  = ctx.request;
        this.__response = ctx.response;
        //check validation
        let validationRules = schema.create({
          task_slug: schema.string({},[]),
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
        let user = this.__request.user();
        let body_params = this.__request.all();
        let slug_arr = body_params.task_slug.split(",")
        await PropertyTask.query().whereIn("slug", slug_arr).delete();

        let getTotalTask = await PropertyTask.getTotalTask(user.id,'0');
        let getTotalTaskCompleted = await PropertyTask.getTotalTask(user.id,'complete');
        let getTotalTaskPending = await PropertyTask.getTotalTask(user.id,'pending');
        let average_task = (getTotalTask * getTotalTaskCompleted) / 100;

        await Database.query().from('users').where('id',user.id).update({
            total_property_task: getTotalTask,
            total_property_task_complete: getTotalTaskCompleted,
            total_property_task_pending: getTotalTaskPending
        })

        //send response
        this.__is_paginate = false;
        this.__collection  = false;

        this.__sendResponse(
          200,
          I18n.locale(this.__request.language()).formatMessage('messages.success_delete_messages'),
          []
        );
        return;

    }
}
