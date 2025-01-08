import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import Controller from "../Controller";
import _ from 'lodash';
import User from 'App/Models/User';
import Notification from 'App/Models/Notification';
// import { fileValidation, generateVideoThumb } from 'App/Helpers/Index';

export default class GeneralController extends Controller {
    protected __resource: string;
    protected __request: object;
    protected __response: object;
    protected __params: object;

    constructor() {
        super();
        this.__request; //adonis request obj
        this.__response; //adonis response obj
        this.__params = {}; // this is used for get parameters from url
    }

    public async index(ctx: HttpContextContract) {
        this.__request = ctx.request;
        this.__response = ctx.response;

        this.__resource = 'Notification';

        let actor = this.__request.user();
        await Notification.updateNotification({ target_id: actor.id }, { is_badge: '0' });

        let notifications = await Notification.getNotificationsByTargetID(actor.id, ctx.request);
        //send response
        this.__is_paginate = true;
        this.__collection = true;
        return this.__sendResponse(
            200,
            'Notifications fetched successfully',
            notifications
        )
    }

    public async readNotification(ctx: HttpContextContract) {
        this.__request = ctx.request;
        this.__response = ctx.response;
        
        this.__resource = 'Notification';

        let validationRules = schema.create({
            id: schema.string({}),
        })

        try {
            await this.__request.validate({ schema: validationRules })
        } catch (error) {
            return this.sendError(
                'Validation Message',
                this.setValidatorMessagesResponse(error.messages),
                400
            )
        }

        let notification = await Notification.updateNotification({ id: this.__request.input('id') }, { is_read: 1, is_view: 1 });

        //send response
        this.__is_paginate = false;
        this.__collection = true;

        return this.__sendResponse(
            200,
            'Notification has been read successfully',
            notification
        )
    }


    public async sendTestNotification(ctx: HttpContextContract) {
    this.__request = ctx.request;
    this.__response = ctx.response;

    let validationRules = schema.create({
        target_user_id: schema.string({}),
    })
    try {
        await this.__request.validate({ schema: validationRules })
    } catch (error) {
        return this.sendError(
            'Validation Message',
            this.setValidatorMessagesResponse(error.messages),
            400
        )
    }

    let actor = this.__request.user();
    let targetUsers = await User.getTargetUsersByID(this.__request.input('target_user_id'));
    if (!_.isEmpty(targetUsers)) {
        let notification_data = {
            actor: actor,
            target: targetUsers,
            module: 'users',
            module_id: actor.id,
            module_slug: actor.slug,
            reference_id: null,
            reference_module: null,
            reference_slug: null,
            title: 'AdonisJS',
            message: 'Testing push notification',
            redirect_link: null,
            badge: 0,
        }
        let custom_data = {
            record_id: actor.id,
            redirect_link: null,
            identifier: 'test-notification'
        }
        Notification.sendNotification(
            'test-notification',
            notification_data,
            custom_data
        ).then();
    }

    //send response
    this.__is_paginate = false;
    this.__collection = false;
    await this.__sendResponse(200, 'Test notification has been sent successfully', []);
    return;
}

    public async getBadgeCount(ctx: HttpContextContract) {
    this.__request = ctx.request;
    this.__response = ctx.response;

    let user = this.__request.user();

    let count = await Notification.getCount({ target_id: user.id, is_badge: 1 });

    // get chat count
    //let chat_count = await Chat.getCount({ target_id: user.id, seen: '0' });
    let chat_count = 0;    
    // send response
    this.__is_paginate = false;
    this.__collection = false;
    await this.__sendResponse(200, 'Notification badge count has been sent successfully', { count: count, chat_count: chat_count });

}
}