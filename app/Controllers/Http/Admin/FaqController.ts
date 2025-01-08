'use strict'
import { schema,rules } from '@ioc:Adonis/Core/Validator'
import CrudController from './CrudController';
import { baseUrl } from 'App/Helpers/Index';
import moment from 'moment';

export default class FaqController extends CrudController
{
    protected __request: any;
    protected __response: any;
    protected __params: any;

    constructor(){
        super('Faq')
        this.__data['page_title'] = 'FAQ';
        this.__indexView  = 'faq.index';
        this.__createView = 'faq.add';
        this.__editView   = 'faq.edit';
        this.__routeName    = 'admin.faq';
        this.__request; //adonis request obj
        this.__response; //adonis response obj
        this.__params = {}; // this is used for get parameters from url
    }

    /**
     *
     * @returns
     */
    protected async storeValidation(cb:any)
    {
        let validationRules;
        validationRules = schema.create({
            question: schema.string({},[
              rules.minLength(2),
              rules.maxLength(200),
            ]),
            answer: schema.string({},[
              rules.minLength(2),
              rules.maxLength(1000),
            ]),
        })
        try{
          await this.__request.validate({ schema: validationRules })
        } catch(error){
            this.__is_error = true;
            let messages = this.setValidatorMessagesResponse(error.messages,'admin')
            cb(messages);
        }
        return true;
    }


    /**
     *
     * @returns
     */
    protected async updateValidation(slug:string, cb:any)
    {
        let validationRules;
        validationRules = schema.create({
            question: schema.string({},[
              rules.minLength(2),
              rules.maxLength(200),
            ]),
            answer: schema.string({},[
              rules.minLength(2),
              rules.maxLength(1000),
            ]),
        })
        try{
          await this.__request.validate({ schema: validationRules })
        } catch(error){
            this.__is_error = true;
            let messages = this.setValidatorMessagesResponse(error.messages,'admin')
            cb(messages);
        }
        return true;
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

    protected async dataTableRecords(record: any)
    {
        let options  = `<a href="${ baseUrl('/admin/faq/'+record.slug + '/edit') }" title="edit" class="btn btn-sm btn-info"><i class="fa fa-edit"></i></a>`;
            options += '<a title="Delete" class="btn btn-sm btn-danger _delete_record"><i class="fa fa-trash"></i></a>';
        return [
            `<input type="checkbox" name="record_id[]" class="record_id" value="${record.slug}"></input>`,
            record.question,
            moment(record.created_at).format('MM-DD-YYYY hh:mm A'),
            options
        ];
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
    protected async afterShowLoadModel(record: any)
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
