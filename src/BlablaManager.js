(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['underscore', './ConversationDataStore', './BlablaRenderHandler'], factory);
    } else {
        // Browser globals
        root.BlablaManager = factory(root._, root.ConversationDataStore, root.BlablaRenderHandler);
    }
}(this, function (_, ConversationDataStore, BlablaRenderHandler) {

"use strict";

/**
 * Description
 * @class BlablaManager
 * @constructor
 * @param {} ConversationDataStore
 * @param {} params
 * @return 
 */
var BlablaManager = function(params){
	this._ConversationDataStore = null;
	this._controllers = {};
	this._memberPropertiesToMixWithMessage = [];

	this.setRH(BlablaRenderHandler);
	this.setCDS(ConversationDataStore);

	/**
	 * Description
	 * @method debugBlablaManager
	 * @param {} msg
	 * @return 
	 */
	window.debugBlablaManager = function(msg){
		if(window.DEBUG_BLABLAMANAGER) console.log(msg);
	}

	
	this.setIdConversation(params.idConversation);
	this.setMemberPropertiesToMixWithMessage(params.memberPropertiesToMixWithMessage);

	this._setBasicController("onCreateConversation", params.onCreateConversation);
	this._setSourceRenderController("getConversation", params.getConversation);
	this._setBasicController("members", params.sourceMembers);
	this._setBasicController("messages", params.sourceMessages);
	this._setSourceRenderController("sendNewMessage", params.sendNewMessage);
	this._setSourceRenderController("deleteMessage", params.deleteMessage);
	this._setSourceRenderController("kickMember", params.kickMember);
	this._setSourceRenderController("joinMember", params.joinMember);
	this._setSourceRenderController("setConnectionStatus", params.setConnectionStatus);
	this._setSourceRenderController("previousUnloadedMessages", params.previousUnloadedMessages);
	this._setSourceRenderController("listenNewMessages", params.listenNewMessages);
	this._setBasicController("stopListenNewMessages", params.stopListenNewMessages);
	
	//execute defined orders on onCreateConversation controller
	this.getControllers().onCreateConversation(this);

}

/**
 * Description
 * @method getControllers
 * @return MemberExpression
 */
BlablaManager.prototype.getControllers = function(){
	return this._controllers;
}

BlablaManager.prototype._setSourceRenderController = function(name_controller, controller){

	switch(false){
		case _.isObject(controller): 
		break;

		case _.has(controller, "source") && _.isFunction(controller.source): 
		break;

		case _.has(controller, "render") && _.isFunction(controller.render): 
		break;

		default: 
			this.getControllers()[""+name_controller+""] = controller;
		break;
	}
}

BlablaManager.prototype._setBasicController = function(name_controller, controller){

	switch(false){
		case _.isFunction(controller): 
		break;

		default: 
			this.getControllers()[""+name_controller+""] = controller;
		break;
	}
}

/**
 * Description
 * @method onCreateConversation
 * @return 
 */
BlablaManager.prototype.onCreateConversation = function()
{
	var onCreateConversation = this.getControllers().onCreateConversation;
	if(!_.isFunction(onCreateConversation)){
		return false;
	}

	onCreateConversation(this);
}

BlablaManager.prototype.setRH = function(RH)
{
	this._RenderHandler = new RH();
}


BlablaManager.prototype.getRH = function(){
	return this._RenderHandler;
}

BlablaManager.prototype.enableRenders = function(){
	this.getRH().dispatchEnqueuedRenders();
	this.getRH().enableRenders();
}

BlablaManager.prototype.disableRenders = function(){
	return this.getRH().disableRenders();
}

/**
 * Description
 * @method setCDS
 * @param {} CDS
 * @return 
 */
BlablaManager.prototype.setCDS = function(CDS)
{
	this._ConversationDataStore = new CDS({});
}





/**
 * Description
 * @method getCDS
 * @return MemberExpression
 */
BlablaManager.prototype.getCDS = function()
{
	return this._ConversationDataStore;
}

/**
 * Description
 * @method setIdConversation
 * @param {} idConversation
 * @return 
 */
BlablaManager.prototype.setIdConversation = function(idConversation)
{
	if(idConversation != null) this.getCDS().setIdConversation(idConversation);
}

/**
 * Description
 * @method getIdConversation
 * @return idConversation
 */
BlablaManager.prototype.getIdConversation = function()
{
	var idConversation = this.getCDS().getIdConversation();
	return idConversation;
}


/**
 * Description
 * @method fetchDataMembers
 * @param {} callbackFn
 * @return 
 */
BlablaManager.prototype.fetchDataMembers = function(callbackFn)
{
	if(!_.isFunction(this.getControllers().members)){
		window.debugBlablaManager('Must define params.sourceMembers before use fetchDataMembers');
		return false;
	}

	var controllerCallback = {};
	var __this = this;

	/**
	 * Description
	 * @method success
	 * @param {} members
	 * @return 
	 */
	controllerCallback.success = function(members){
		__this.getCDS().resetMembers();

		if(!__this.getCDS().addMembers(members)){
			window.debugBlablaManager('cant add members');
			var members = [];
		}
		
		if(_.isFunction(callbackFn)) callbackFn(members);
	}

	this.getControllers().members(controllerCallback);
}

/**
 * Description
 * @method fetchDataMessages
 * @param {} callbackFn
 * @return 
 */
BlablaManager.prototype.fetchDataMessages = function(callbackFn)
{
	if(!_.isFunction(this.getControllers().messages)){
		window.debugBlablaManager('Must define params.sourceMessages before use fetchDataMessages');
		return false;
	}

	var controllerCallback = {};
	var __this = this;

	/**
	 * Description
	 * @method success
	 * @param {} messages
	 * @return 
	 */
	controllerCallback.success = function(messages){
		__this.getCDS().resetMessages();

		if(!__this.getCDS().addMessages(messages)){
			window.debugBlablaManager('cant fetch data messages');
			var messages = [];
		}

		if(_.isFunction(callbackFn)) callbackFn({messages: messages});
	};

	this.getControllers().messages(controllerCallback);
}

/**
 * Description
 Loads data conversation from source and renders 
 * @method getConversation
 * @param {} callbackFn
 * @return 
 */
BlablaManager.prototype.loadConversation = function(callbackFn){
	return this._getConversation(callbackFn, true);
}


/**
 * Description
 Loads all the conversation data to DataStore from the controller.source 
 but doesnt call controler.render
 * @method fetchConversation
 * @param {} callbackFn
 * @return 
 */
BlablaManager.prototype.fetchConversation = function(callbackFn){
	return this._getConversation(callbackFn, false);
}

BlablaManager.prototype._getConversation = function(callbackFn, render){
	var controller = this.getControllers().getConversation;
	var must_render = ((_.isBoolean(render)) ? render : false);

	if(!_.isObject(controller)){
		window.debugBlablaManager('Must define params.getConversation before use getConversation');
		return false;
	}

	var controllerCallback = {};
	var __this = this;

	controllerCallback.success = function(conversation){
		if(!_.has(conversation, "members") || !_.has(conversation, "messages")){
			window.debugBlablaManager('data provided by controllerCallback.success needs members and messages');
			return false;
		}

		__this.getCDS().resetMembers();
		__this.getCDS().resetMessages();
		__this.getCDS().addMembers(conversation.members);
		__this.getCDS().addMessages(conversation.messages);

		conversation.messages = __this.extendMessages(conversation.messages);
		if(must_render){
			__this.getRH().capture(controller.render, conversation);
		}

		if(_.isFunction(callbackFn)) callbackFn(conversation);
	}

	controller.source(controllerCallback);	
}



/**
 * Description
 * @method getPreviousUnloadedMessages
 * @param {} requested_messages
 * @param {} callbackFn
 * @return 
 */
BlablaManager.prototype.getPreviousUnloadedMessages = function(requested_messages, callbackFn)
{
	if(!_.isObject(this.getControllers().previousUnloadedMessages)){
		window.debugBlablaManager('Must define params.previousUnloadedMessages before use getPreviousUnloadedMessages');
		return false;
	}

	var controller = this.getControllers().previousUnloadedMessages;

	var searchData = {
		requested: parseInt(requested_messages), 
		since: this.getCDS().getTotalMessages()
	}

	var controllerCallback = {};
	var __this = this;

	/**
	 * Description
	 * @method success
	 * @param {} messages
	 * @return 
	 */
	controllerCallback.success = function(messages){
		if(!__this.getCDS().prependMessages(messages)){
			window.debugBlablaManager('old messages cant be added');
			var messages = [];
		}

		var extendedMessages = __this.extendMessages(messages);
		__this.getRH().capture(controller.render, extendedMessages.reverse());

		if(_.isFunction(callbackFn)) callbackFn(extendedMessages);
	};

	controller.source(searchData, controllerCallback);
}


/**
 * Description
 * @method kickMember
 * @param {} idMember
 * @param {} callbackFn
 * @return 
 */
BlablaManager.prototype.kickMember = function(idMember, callbackFn)
{
	var controller = this.getControllers().kickMember;
	var member = this.getCDS().getMember(idMember);
	window.debugBlablaManager('kicking member sdfsfds')
	window.debugBlablaManager(member)

	var controllerCallback = {};
	var __this = this;

	/**
	 * Description
	 * @method success
	 * @return 
	 */
	controllerCallback.success = function(){		
		__this.getCDS().deleteMember(idMember);
		window.debugBlablaManager('member kicked correctly');
		__this.getRH().capture(controller.render, member);
		if(_.isFunction(callbackFn)) callbackFn(member);
	};

	controller.source(member, controllerCallback);
}

/**
 * Description
 * @method joinMember
 * @param {} member
 * @param {} callbackFn
 * @return 
 */
BlablaManager.prototype.joinMember = function(member, callbackFn)
{
	var controller = this.getControllers().joinMember;
	var controllerCallback = {};
	var __this = this;

	/**
	 * Description
	 * @method success
	 * @param {} member
	 * @return 
	 */
	controllerCallback.success = function(member){
		if(__this.getCDS().addMembers(member)){
			window.debugBlablaManager('member joined correctly');
			__this.getRH().capture(controller.render, member);
			if(_.isFunction(callbackFn)) callbackFn(member);
		}
	};

	controller.source(member, controllerCallback);
}

/**
 * Description
 * @method sendNewMessage
 * @param {} message
 * @param {} callbackFn
 * @return 
 */
BlablaManager.prototype.sendNewMessage = function(message, callbackFn)
{
	var controller = this.getControllers().sendNewMessage;
	var idMessage = this.getCDS().getIdObject(message);
	var controllerCallback = {};
	var __this = this;

	if(!this.getCDS().addMessages(message)){
		window.debugBlablaManager('Cant add this message');
		return false;
	}

	//for a better user experience, controller.render doesnt wait 
	//to be called from controllerCallback
	var extendedMessage = __this.extendMessages(message);
	__this.getRH().capture(controller.render, extendedMessage);

	/**
	 * Description
	 * @method success
	 * @param {} message
	 * @return 
	 */
	controllerCallback.success = function(message){
		__this.getCDS().unsetMessageFailedToSent(idMessage);
		var message = __this.getCDS().getMessage(idMessage);
		var extendedMessage = __this.extendMessages(message);

		window.debugBlablaManager('message sent correctly');
		__this.getRH().capture(controller.render, extendedMessage);
		if(_.isFunction(callbackFn)) callbackFn(extendedMessage);
	};

	/**
	 * Description
	 * @method fail
	 * @param {} message
	 * @return 
	 */
	controllerCallback.fail = function(message){
		__this.getCDS().setMessageFailedToSent(idMessage);
		var message = __this.getCDS().getMessage(idMessage);
		var extendedMessage = __this.extendMessages(message);

		window.debugBlablaManager('message failed');
		__this.getRH().capture(controller.render, extendedMessage);
		if(_.isFunction(callbackFn)) callbackFn(extendedMessage);
	};

	controller.source(message, controllerCallback);
}


/**
 * Description
 * @method listenNewMessages
 * @param {} callbackFn
 * @return 
 */
BlablaManager.prototype.listenNewMessages = function(callbackFn)
{
	var controller = this.getControllers().listenNewMessages;
	var controllerCallback = {};
	var __this = this;

	window.debugBlablaManager('Started listening new messages');

	/**
	 * Description
	 * @method success
	 * @param {} messages
	 * @return 
	 */
	controllerCallback.success = function(messages){
		if(!__this.getCDS().addMessages(messages)){
			window.debugBlablaManager('Cant add this message');
			return false;
		}

		var extendedMessages = __this.extendMessages(messages);
		window.debugBlablaManager('message received correctly');
		__this.getRH().capture(controller.render, extendedMessages);
		if(_.isFunction(callbackFn)) callbackFn(extendedMessages);
	};

	controller.source(controllerCallback);
}

/**
 * Description
 * @method stopListenNewMessages
 * @param {} callbackFn
 * @return 
 */
BlablaManager.prototype.stopListenNewMessages = function(callbackFn)
{
	var controller = this.getControllers().stopListenNewMessages;
	controller();
	window.debugBlablaManager('Stopped listening new messages');
	if(_.isFunction(callbackFn)) callbackFn();
}

/**
 * Description
 * @method deleteMessage
 * @param {} idMessage
 * @param {} callbackFn
 * @return 
 */
BlablaManager.prototype.deleteMessage = function(idMessage, callbackFn)
{
	var controllerCallback = {};
	var controller = this.getControllers().deleteMessage;
	var __this = this;

	/**
	 * Description
	 * @method success
	 * @param {} data
	 * @return 
	 */
	controllerCallback.success = function(data){
		__this.getCDS().deleteMessage(idMessage);
		window.debugBlablaManager('message removed correctly');
		__this.getRH().capture(controller.render, {"id": idMessage});
		if(_.isFunction(callbackFn)) callbackFn(data);
	};

	controller.source(idMessage, controllerCallback);
}

/**
 * Description
 * @method setConnectionStatus
 * @param {} idMember
 * @param {} statusMember
 * @param {} callbackFn
 * @return 
 */
BlablaManager.prototype.setConnectionStatus = function(idMember, statusMember, callbackFn)
{
	var controllerCallback = {};
	var controller = this.getControllers().setConnectionStatus;
	var __this = this;

	/**
	 * Description
	 * @method success
	 * @return 
	 */
	controllerCallback.success = function(){
		var member = __this.getCDS().setMemberProperties(idMember, {status: statusMember});		
		if(!member){
			window.debugBlablaManager('status cant be changed. Error');
		}
		else{
			__this.getRH().capture(controller.render, member);
		}
		
		if(_.isFunction(callbackFn)) callbackFn(member);
	}

	controller.source(idMember, controllerCallback);
}

/**
 * Description
 * @method extendMessages
 * @param {} messages
 * @return CallExpression
 */
BlablaManager.prototype.extendMessages = function(messages)
{
	return this._mixMessagesWithMemberProperties(messages);
}

/**
 * Description
 * @method setMemberPropertiesToMixWithMessage
 * @param {} properties
 * @return 
 */
BlablaManager.prototype.setMemberPropertiesToMixWithMessage = function(properties)
{

	if(_.isNull(properties) || _.isEmpty(properties)){
		this._memberPropertiesToMixWithMessage = [];
		return false;
	}

	if(_.isArray(properties)){
		this._memberPropertiesToMixWithMessage = properties;
	}
	
	if(_.isString(properties)){
		var array = [""+properties+""];
		this._memberPropertiesToMixWithMessage = array;
	}
}

/**
 * Description
 * @method getMemberPropertiesToMixWithMessage
 * @return MemberExpression
 */
BlablaManager.prototype.getMemberPropertiesToMixWithMessage = function()
{
	return this._memberPropertiesToMixWithMessage;
}

BlablaManager.prototype._getMessageMixedWithMemberProperty = function(message, member, property)
{
	if(member != undefined){
		message[property] = member[property];
	}
	else{
		message[property] = "";
	}
	return message;
}

BlablaManager.prototype._mixMessagesWithMemberProperties = function(messages)
{
	var propertiesToMix = this.getMemberPropertiesToMixWithMessage();
	if(_.isEmpty(propertiesToMix)){
		return messages;
	}
	if(!_.isArray(messages)){
		messages = [messages];
	}

	var messagesMixed = [];
	var messages = messages;
	var messagesLength = messages.length;
	var __this = this;

	for(var i = 0; i < messagesLength; i++){
		var member = this.getCDS().getMember(messages[i].idUser);
		var currentMessage = messages[i];
		
		_.each(propertiesToMix, function(property){
			currentMessage = __this._getMessageMixedWithMemberProperty(
									currentMessage, 
									member, 
									property
								);
		});

		messagesMixed.push(currentMessage);
	}

	if(messagesMixed.length == 1){
		return messagesMixed[0];
	}

	return messagesMixed;
}

return BlablaManager;

}));