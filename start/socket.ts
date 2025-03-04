import Ws from 'App/Services/Ws';
import SocketAuthorization from 'App/Middleware/SocketAuthorization';
import _ from 'lodash';
import Controller from 'App/Controllers/Http/Controller';
import Env from '@ioc:Adonis/Core/Env'
import User from 'App/Models/User';
import { validator, schema, rules } from '@ioc:Adonis/Core/Validator';
import ChatGroup from 'App/Models/ChatGroup';
import Chat from 'App/Models/Chat';
import { currentDateTime } from 'App/Helpers/Index'

const baseController = new Controller();
Ws.boot()


Ws.io.use(async (socket: any, next) => {
  //join socket
  console.log('check_socket.........................',socket.handshake)
  let auth = await SocketAuthorization.handle(socket.handshake.query.Authorization);
  if (_.isEmpty(auth)) {
    return await next(new Error("unauthorized error"));
  }
  socket.join('sck_'+auth.id);
  socket.auth = auth.toJSON();
  next();
}).on('connection', (socket: any) => {
  let user = socket.auth;
  let slug = user.slug;
  baseController.__socket = socket;
  //Join Socket

  socket.on('_join_room', async (params, callback) => {

    let validationRules = schema.create({
      user_id: schema.string()
    })
    let validatorFails = await baseController.validateSocketParams(params, validationRules, callback, '_on_join_room')
    if (validatorFails){
      let err_response = baseController.sendSocketError(400, "Validation Error", validatorFails);
      socket.emit('_on_join_room', err_response)
      callback(err_response);
    }else{
      User.updateUser({ is_socket: '1' }, { id:user.id });
      user = await User.getUserByEmail(user.email)
      // user.online_status = '1';
      baseController.__is_paginate = false;
      baseController.__resource = 'PublicUser';
      let response = await baseController.sendScktResponse(200, 'User join socket successfully', user);
      socket.emit('_on_join_room', response)
      callback(response)
    }
  
  });

  socket.on('_send_message', async (params, callback) => {
    let validationRules = schema.create({
      reciever_id: schema.number(),
      sender_id: schema.number(),
      message: schema.string(),
      type: schema.enum(['file', 'text', 'image', 'video'])
    })
    let validatorFails = await baseController.validateSocketParams(params, validationRules, callback, '_recieve_message')
    if (validatorFails){
      let err_response = baseController.sendSocketError(400, "Validation Error", validatorFails);
      socket.emit('_recieve_message', err_response)
      callback(err_response);
    }else{
        let getGroup = await ChatGroup.checkChat(params.sender_id,params.reciever_id)
        params.group_id = getGroup.id,
        params.seen = '1';
        let data = await Chat.createChat(params);
        baseController.__is_paginate = false;
        baseController.__resource = 'Chat';
        let response = await baseController.sendScktResponse(200, 'Message send successfully', data);
        let total_unread_messages = await Chat.getCountUnseenMessages(params.group_id,params.reciever_id);
        let updateGroup = await ChatGroup.updateGroup({ reciever_seen: '1', 'total_unread_messages': total_unread_messages,'updated_at':currentDateTime() },{'id':getGroup.id})
        socket.to('sck_'+params.reciever_id).emit('_recieve_message', response)
        socket.emit('_recieve_message', response)
        callback(response)
  }
  });

  socket.on('_load_recent_chat', async (params, callback) => {
    
    let validationRules = schema.create({
      reciever_id: schema.number(),
      sender_id: schema.number(),
    })
    let validatorFails = await baseController.validateSocketParams(params, validationRules, callback, '_recent_chat')
    if (validatorFails){
      let err_response = baseController.sendSocketError(400, "Validation Error", validatorFails);
      socket.emit('_recent_chat', err_response)
      callback(err_response);
    }else{
      let getGroup = await ChatGroup.checkChat(params.sender_id,params.reciever_id)
      baseController.__is_paginate = false;
      baseController.__resource = 'Chat';
      let response;
        if(_.isEmpty(getGroup)){
          response = await baseController.sendScktResponse(200, 'Retrive Recent Chat', []);
        }else{
          let data = await Chat.getRecentChat(getGroup.id);
          let updateChat = await Chat.updateChat({ seen: '0'},{'reciever_id':params.sender_id,'sender_id':params.reciever_id,'group_id':getGroup.id})
          let total_unread_messages = await Chat.getCountUnseenMessages(getGroup.id,params.reciever_id);
          let updateGroup = await ChatGroup.updateGroup({ reciever_seen: '0', 'total_unread_messages': total_unread_messages },{'id':getGroup.id})
          response = await baseController.sendScktResponse(200, 'Retrive Recent Chat', data);
        }
        socket.emit('_recent_chat', response)
        callback(response)
    }
  })
    

})