import RestController from './RestController'
import { schema,rules } from '@ioc:Adonis/Core/Validator'
import _ from 'lodash'
import I18n from '@ioc:Adonis/Addons/I18n'
import Transaction from 'App/Models/Transaction'
import Database from '@ioc:Adonis/Lucid/Database'
import { strSlug, rand, currentDateTime } from 'App/Helpers/Index'

const moment = require('moment');

export default class TransactionController extends RestController
{
    protected __resource: string;
    protected __request: any;
    protected __response: any;
    protected __params: any;

    constructor() {
        super("Transaction");
        this.__resource = "Transaction";
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
          subscription_id: schema.string({}),
          transaction_id: schema.string({}),
          gateway_type: schema.enum.optional(['google-pay','apple-pay','strip']),
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
          subscription_id: schema.string({}),
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
          // let params = this.__request.all();
          // let check_transaction = await Transaction.query().where('user_id',this.__request.user().id).where('transaction_id',params.transaction_id).where('gateway_type',params.gateway_type).first();
          // let current_date = moment().format("YYYY-MM-DD")
          // if(!_.isEmpty(check_transaction)){
          //   check_transaction.toJSON();
          //   if(current_date > check_transaction.subscription_end_date){
          //       this.__is_error = true;
          //       return this.sendError(
          //         I18n.locale(this.__request.language()).formatMessage('messages.validation_msg'),
          //         { message: I18n.locale(this.__request.language()).formatMessage('messages.transaction_expire'), },
          //         400
          //       )
          //   }else{
          //       this.__is_error = true;
          //       return this.sendError(
          //         I18n.locale(this.__request.language()).formatMessage('messages.validation_msg'),
          //         { message: I18n.locale(this.__request.language()).formatMessage('messages.transaction_already_exist'), },
          //         400
          //       )
          //   }
            
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
