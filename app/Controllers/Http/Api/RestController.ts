"use strict";
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Controller from '../Controller';
import _ from 'lodash';
import I18n from '@ioc:Adonis/Addons/I18n'

export default abstract class RestController extends Controller {

    protected __model: any;
    protected __success_listing_message: string;
    protected __success_store_message: string;
    protected __success_show_message: string;
    protected __success_update_message: string;
    protected __success_delete_message: string;
    declare protected __params:any;

    constructor(model: string) {
        super();
        this.__model = this.loadModel(model);
        this.__success_listing_message = 'messages.success_listing_message';
        this.__success_store_message   = 'messages.success_store_message';
        this.__success_show_message    = 'messages.success_show_message';
        this.__success_update_message  = 'messages.success_update_message';
        this.__success_delete_message  = 'messages.success_delete_message';
    }

    protected abstract validation(action: string, slug?: string): Promise<void>;
    protected abstract beforeIndexLoadModel(): Promise<void>
    protected abstract afterIndexLoadModel(record:any): Promise<void>
    protected abstract beforeStoreLoadModel(): Promise<void>
    protected abstract afterStoreLoadModel(record:any): Promise<void>
    protected abstract beforeShowLoadModel(): Promise<void>
    protected abstract afterShowLoadModel(record:any): Promise<void>
    protected abstract beforeUpdateLoadModel(): Promise<void>
    protected abstract afterUpdateLoadModel(record:any): Promise<void>
    protected abstract beforeDestoryLoadModel(): Promise<void>
    protected abstract afterDestoryLoadModel(): Promise<void>

    /**
     * Show a list of all users.
     * GET users
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    public async index(ctx: HttpContextContract)
    {
        this.__request  = ctx.request;
        this.__response = ctx.response;
        //check validation
        if (_.isFunction(this.validation)) {
            let validator = await this.validation("index");
            if( this.__is_error == true )
              return validator;
        }
        // before store hook
        if (_.isFunction(this.beforeIndexLoadModel)) {
            var hookResponse = await this.beforeIndexLoadModel();
            if (this.__is_error) {
                return hookResponse;
            }
        }

        let records  = await this.__model.getRecords(this.__request,this.__request.all());
        // after store hook
        if (_.isFunction(this.afterIndexLoadModel)) {
            var afterHookResponse = await this.afterIndexLoadModel(records);
            if ( typeof afterHookResponse != 'undefined' ) {
              records = afterHookResponse;
            }
        }

        await this.__sendResponse(
          200,
          I18n.locale(this.__request.language()).formatMessage(this.__success_listing_message),
          records
        );
        return;
    }

    /**
     * Create/save a new user.
     * POST users
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async store(ctx: HttpContextContract)
    {
        this.__request  = ctx.request;
        this.__response = ctx.response;
        //check validation
        if (_.isFunction(this.validation)) {
            let validator = await this.validation("store");
            if( this.__is_error == true )
              return validator;
        }
        // before store hook
        if (_.isFunction(this.beforeStoreLoadModel)) {
            var hookResponse = await this.beforeStoreLoadModel();
            if (this.__is_error) {
                return hookResponse;
            }
        }

        let record  = await this.__model.createRecord(this.__request,this.__request.only( this.__model.fillable() ));
        // after store hook
        if (_.isFunction(this.afterStoreLoadModel)) {
            var afterHookResponse = await this.afterStoreLoadModel(record);
            if ( typeof afterHookResponse != 'undefined' ) {
              record = afterHookResponse;
            }
        }
        this.__is_paginate = false;
        await this.__sendResponse(
          200,
          I18n.locale(this.__request.language()).formatMessage(this.__success_store_message),
          record
        );
        return;
    }

    /**
     * Display a single user.
     * GET users/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async show(ctx: HttpContextContract)
    {
        this.__request  = ctx.request;
        this.__response = ctx.response;
        this.__params   = ctx.params;
        // before show hook
        if (_.isFunction(this.beforeShowLoadModel)) {
            var hookResponse = this.beforeShowLoadModel();
            if (this.__is_error) {
                return hookResponse;
            }
        }
        let record = await this.__model.getRecordBySlug(this.__request, this.__params.id);
        // after show hook
        if (_.isFunction(this.afterShowLoadModel)) {
            var afterHookResponse = await this.afterShowLoadModel(record);
            if ( typeof afterHookResponse != 'undefined' ) {
                record = afterHookResponse;
            }
        }
        this.__is_paginate = false;
        await this.__sendResponse(
          200,
          I18n.locale(this.__request.language()).formatMessage(this.__success_show_message),
          record
        );
        return;
    }

    /**
     * Update user details.
     * PUT or PATCH users/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async update(ctx: HttpContextContract)
    {
        this.__request  = ctx.request;
        this.__response = ctx.response;
        this.__params   = ctx.params;
        //validation
        if (_.isFunction(this.validation)) {
            let validator = await this.validation("update");
            if( this.__is_error == true )
              return validator;
        }
        //before update hook
        if (_.isFunction(this.beforeUpdateLoadModel)) {
            var hookResponse = await this.beforeUpdateLoadModel();
            if (this.__is_error) {
                return hookResponse;
            }
        }
        let record = await this.__model.updateRecord(
            this.__request,
            this.__request.only( this.__model.fillable() ),
            this.__params.id
        );
        //before update hook
        if (_.isFunction(this.afterUpdateLoadModel)) {
            var afterHookResponse = await this.afterUpdateLoadModel(record);
            if ( typeof afterHookResponse != 'undefined' ) {
              record = afterHookResponse;
            }
        }
        this.__is_paginate = false;
        await this.__sendResponse(
          200,
          I18n.locale(this.__request.language()).formatMessage(this.__success_update_message),
          record
        );
        return;
    }

    /**
     * Delete a user with id.
     * DELETE users/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async destroy(ctx: HttpContextContract)
    {
        let record      = [];
        this.__request  = ctx.request;
        this.__response = ctx.response;
        this.__params   = ctx.params;
        //before destroy hook
        if (_.isFunction(this.beforeDestoryLoadModel)) {
            var hookResponse = await this.beforeDestoryLoadModel();
            if (this.__is_error) {
                return hookResponse;
            }
        }
        await this.__model.deleteRecord(this.__request, this.__request.all(), this.__params.id);
        //after destroy hook
        if (_.isFunction(this.afterDestoryLoadModel)) {
            var afterHookResponse = await this.afterDestoryLoadModel();
            if ( typeof afterHookResponse != 'undefined' ) {
                record = afterHookResponse;
            }
        }
        this.__is_paginate = false;
        let language = this.__request.header('Accept-language');
            language = _.isEmpty(language) ? 'en' : language;

        await this.__sendResponse(
          200,
          I18n.locale(this.__request.language()).formatMessage(this.__success_delete_message),
          record
        );
        return;
    }

    /**
     * Load Model
     * @param name
     * @returns {object} model instance
     */
    private loadModel(name: string) :any {
       return require(`App/Models/${name}`).default;
    }
}
