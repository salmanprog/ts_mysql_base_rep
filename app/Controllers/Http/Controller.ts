//import I18n from '@ioc:Adonis/Addons/I18n'
import Drive from '@ioc:Adonis/Core/Drive'
import {baseUrl} from 'App/Helpers/Index'
import ApplicationSetting from 'App/Models/ApplicationSetting';
import moment from 'moment';
import Application from '@ioc:Adonis/Core/Application'
import _ from 'lodash';
import { validator } from '@ioc:Adonis/Core/Validator'
import SocketValidationMessages from 'App/Helpers/ValidationMessages';

export default class Controller {

    protected __is_error: boolean;
    protected __is_paginate: boolean;
    protected __collection: boolean;
    public __socket: any;
    declare protected __request: any;
    declare protected __response:any;
    declare protected __resource:any;

    constructor() {
        this.__is_error    = false;
        this.__is_paginate = true;
        this.__collection  = true;
    }

    /**
     * @param {object} validationRules
     * @returns
     */
    protected async __validate(validationSchema: any,customMessages:any = {})
    {
        let language = this.__request.header('Accept-language');
            language = _.isEmpty(language) ? 'en' : language;

        let validationMessages = require(Application.resourcesPath(`lang/${language}/validator.json`));
            validationMessages = {...validationMessages, ...customMessages};

        validationSchema.messages = validationMessages
        return await this.__request.validate(validationSchema);
    }

    /**
     *
     * @param {*} messages
     * @returns
     */
    protected setValidatorMessagesResponse( messages: any , type:string = 'api' )
    {
        let error_messages = type == 'api' ? {} : '';
        messages = messages.errors;
        if( messages.length > 0 ){
            for( var i=0; i < messages.length; i++ )
            {
                if( type == 'api' )
                  error_messages[messages[i].field] = messages[i].message;
                else
                  error_messages += '<p>'+ messages[i].message +'</p>';
            }
        }
        return error_messages;
    }

    /**
     *
     * @param code
     * @param message
     * @param data
     * @returns {Promise<void>}
     */
    protected async __sendResponse(code:number = 200, message:string = "success", data:any = {}): Promise<void>
    {
        let links = this.paginateLinks(data);
        let results = this.__is_paginate ? data.data : data;
        let obj:any = {};
        if (this.__collection) {
            let resource = this.loadResource();
            results = await resource.initResponse(results,this.__request);

            obj.code = code;
            obj.data = results;
            obj.message = message;
            obj.pagination = links;
        } else {
            obj.code = code;
            obj.data = results;
            obj.message = message;
            obj.pagination = links;
        }
        this.__response.status(code).send(obj);
        return;
    }

     /**
     *
     * @param data
     * @returns {{next: null, last: null, prev: null, first: null}|{next: number, per_page: number, total: (number|number), current: number, prev: number}}
     */
      private paginateLinks(data:any): any
      {
        let meta:any = {};
        if (this.__is_paginate) {
            meta = {
                total: data.meta.total,
                per_page: data.meta.per_page,
                current_page: data.meta.current_page,
                last_page: data.meta.last_page,
                prev: parseInt(data.meta.current_page) - 1,
                next: parseInt(data.meta.current_page) + 1,
            };
        } else {
            meta = {
                total: null,
                per_page: null,
                current_page: null,
                last_page: null,
                prev:null,
                next:null
            };
        }
        return {
          meta: meta
        };
    }

    /**
     *
     * @param error
     * @param error_messages
     * @param http_code
     */
    protected sendError( error:string = 'Validation Message', error_message:object = {}, http_status_code:number = 400)
    {
        let obj = {
            code: http_status_code,
            message: error,
            data: error_message,
        };
        this.__response.status(http_status_code).send(obj);
        return;
    }

    protected async loadAdminView(viewClass: object, viewPath: string, data: Array<string | object> = [])
    {
      let driveUrl = baseUrl() + await Drive.getUrl('/');
      data.storage_url = function(path){
         return driveUrl + path;
      }
      data.application_setting = await ApplicationSetting.getSetting('application_setting');
      data.current_year = moment().format('YYYY');
      return viewClass.render('admin.'+ viewPath,data);
    }


    async validateSocketParams(data: any, schema: any, callback: Function | undefined, listener: string, to = null) {
        
        // let validationMessages = require(Application.resourcesPath(`lang/en/validator.json`));
        //     validationMessages = {...validationMessages, ...customMessages};
        
        // validationSchema.messages = validationMessages
        
        try {
            await validator.validate({ data, schema, messages: SocketValidationMessages });
            return false;
        }
        catch (err) {
            let errors = {}
            Object.entries(err.messages).map(([key, value]) => {
                errors[key] = value[0];
            })
            // console.log('')
            // this.sendSocketError(err.message, errors, 400, callback, listener, to);
            return errors;
        }
    }

    async setSocketValidatorMessagesResponse( messages: any , type:string = 'api' )
    {
        let error_messages = type == 'api' ? {} : '';
        messages = messages.errors;
        if( messages.length > 0 ){
            for( var i=0; i < messages.length; i++ )
            {
                if( type == 'api' )
                  error_messages[messages[i].field] = messages[i].message;
                else
                  error_messages += '<p>'+ messages[i].message +'</p>';
            }
        }
        return error_messages;
    }

    async sendScktResponse(code: number = 200, message: string = "success", data: object = {}) {
        let results = data;
        let obj = {};
        if (this.__collection) {  
            let resource = this.loadSocketResource();
            results = await resource.initResponse(results, this.request);

            obj.code = code;
            obj.message = message;
            obj.data = results;
            //obj.links = links;
        } else {
            obj.code = code;
            obj.message = message;
            obj.data = results;
            //obj.links = links;
        }
        return obj;
    }

    sendSocketError( http_status_code: number = 400, error: string = '', data: any = []) {
        let response = {
            code: http_status_code,
            message: error,
            data: data,
        };
        return response;
    }
    /**
     *
     * @returns {*}
     */
    private loadResource(): any
    {
        return require(`App/Controllers/Http/Resource/${this.__resource}`).default;
    }

    private loadSocketResource()
    {
        return require(`App/Controllers/Http/Resource/${this.__resource}`).default;
    }
}
