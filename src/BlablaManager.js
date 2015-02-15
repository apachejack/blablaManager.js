(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['underscore'], factory);
    } else {
        // Browser globals
        root.BlablaManager = factory(root._);
    }
}(this, function (_) {

var BlablaManager = function(ConversationDataStore, params){
	this._ConversationDataStore = null;
	this._controllers = {};
	this._memberPropertiesToMixWithMessage = [];

	window.debugBlablaManager = function(msg){
		if(window.DEBUG_BLABLAMANAGER) console.log(msg);
	}

	this.setCDS(ConversationDataStore);
	this.setIdConversation(params.idConversation);
	this.setMemberPropertiesToMixWithMessage(params.memberPropertiesToMixWithMessage);

	this._setBasicController("onCreateConversation", params.onCreateConversation);
	this._setBasicController("members", params.sourceMembers);
	this._setBasicController("messages", params.sourceMessages);
	this._setBasicController("conversation", params.sourceConversation);
	this._setSourceRenderController("sendNewMessage", params.sendNewMessage);
	this._setSourceRenderController("deleteMessage", params.deleteMessage);
	this._setSourceRenderController("kickMember", params.kickMember);
	this._setSourceRenderController("joinMember", params.joinMember);
	this._setSourceRenderController("setConnectionStatus", params.setConnectionStatus);
	this._setSourceRenderController("previousUnloadedMessages", params.previousUnloadedMessages);
	this._setSourceRenderController("listenNewMessages", params.listenNewMessages);
	this._setBasicController("stopListenNewMessages", params.stopListenNewMessages);

	if(_.isObject(params.getConversation)){
		this.getControllers().getConversation = params.getConversation;
	}

	this.onCreateConversation();

}

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

BlablaManager.prototype.onCreateConversation = function()
{
	var onCreateConversation = this.getControllers().onCreateConversation;
	if(!_.isFunction(onCreateConversation)){
		return false;
	}

	onCreateConversation(this);
}


BlablaManager.prototype.setCDS = function(CDS)
{
	this._ConversationDataStore = new CDS({});
}

BlablaManager.prototype.getCDS = function()
{
	return this._ConversationDataStore;
}

BlablaManager.prototype.setIdConversation = function(idConversation)
{
	if(idConversation != null) this.getCDS().setIdConversation(idConversation);
}

BlablaManager.prototype.getIdConversation = function()
{
	return this.getCDS().getIdConversation();
}

BlablaManager.prototype.fetchDataConversation = function(callbackFn)
{
	if(!_.isFunction(this.getControllers().conversation)){
		window.debugBlablaManager('Must define params.sourceConversation before use fetchDataConversation');
		return false;
	}

	var controllerCallback = {};
	var __this = this;

	controllerCallback.success = function(data){
		if(!_.has(data, "members") || !_.has(data, "messages")){
			window.debugBlablaManager('data provided by controllerCallback.success needs members and messages');
			return false;
		}

		__this.getCDS().resetMembers();
		__this.getCDS().resetMessages();
		__this.getCDS().addMembers(data.members);
		__this.getCDS().addMessages(data.messages);
		if(_.isFunction(callbackFn)) callbackFn(data);
	};

	this.getControllers().conversation(controllerCallback);
}

BlablaManager.prototype.fetchDataMembers = function(callbackFn)
{
	if(!_.isFunction(this.getControllers().members)){
		window.debugBlablaManager('Must define params.sourceMembers before use fetchDataMembers');
		return false;
	}

	var controllerCallback = {};
	var __this = this;

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

BlablaManager.prototype.fetchDataMessages = function(callbackFn)
{
	if(!_.isFunction(this.getControllers().messages)){
		window.debugBlablaManager('Must define params.sourceMessages before use fetchDataMessages');
		return false;
	}

	var controllerCallback = {};
	var __this = this;

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

BlablaManager.prototype.getConversation = function(callbackFn){
	if(!_.isObject(this.getControllers().getConversation)){
		window.debugBlablaManager('Must define params.getConversation before use getConversation');
		return false;
	}

	var controller = this.getControllers().getConversation;
	var controllerCallback = {};

	var existsSavedConversation = this.getCDS().existsSavedConversation();

	if(existsSavedConversation){
		window.debugBlablaManager('Accesing conversation from dataStore');
		existsSavedConversation.messages = this.extendMessages(existsSavedConversation.messages);
		controller.render(existsSavedConversation);
		if(_.isFunction(callbackFn)) callbackFn(existsSavedConversation);
	}
	else{
		var __this = this;
		window.debugBlablaManager('Accesing conversation from source');
		this.fetchDataConversation(function(conversation){
			conversation.messages = __this.extendMessages(conversation.messages);
			controller.render(conversation);
			if(_.isFunction(callbackFn)) callbackFn(conversation);
		});
	}

}


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

	controllerCallback.success = function(messages){
		if(!__this.getCDS().prependMessages(messages)){
			window.debugBlablaManager('old messages cant be added');
			var messages = [];
		}

		var extendedMessages = __this.extendMessages(messages);
		controller.render(extendedMessages.reverse());

		if(_.isFunction(callbackFn)) callbackFn(extendedMessages);
	};

	controller.source(searchData, controllerCallback);
}


BlablaManager.prototype.kickMember = function(idMember, callbackFn)
{
	var controller = this.getControllers().kickMember;
	var member = this.getCDS().getMember(idMember);
	window.debugBlablaManager('kicking member sdfsfds')
	window.debugBlablaManager(member)

	var controllerCallback = {};
	var __this = this;

	controllerCallback.success = function(){		
		__this.getCDS().deleteMember(idMember);
		window.debugBlablaManager('member kicked correctly');
		controller.render(member);
		if(_.isFunction(callbackFn)) callbackFn(member);
	};

	controller.source(member, controllerCallback);
}

BlablaManager.prototype.joinMember = function(member, callbackFn)
{
	var controller = this.getControllers().joinMember;
	var controllerCallback = {};
	var __this = this;

	controllerCallback.success = function(member){
		if(__this.getCDS().addMembers(member)){
			window.debugBlablaManager('member joined correctly');
			controller.render(member);
			if(_.isFunction(callbackFn)) callbackFn(member);
		}
	};

	controller.source(member, controllerCallback);
}

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
	controller.render(extendedMessage);

	controllerCallback.success = function(message){
		__this.getCDS().unsetMessageFailedToSent(idMessage);
		var message = __this.getCDS().getMessage(idMessage);
		var extendedMessage = __this.extendMessages(message);

		window.debugBlablaManager('message sent correctly');
		controller.render(extendedMessage);
		if(_.isFunction(callbackFn)) callbackFn(extendedMessage);
	};

	controllerCallback.fail = function(message){
		__this.getCDS().setMessageFailedToSent(idMessage);
		var message = __this.getCDS().getMessage(idMessage);
		var extendedMessage = __this.extendMessages(message);

		window.debugBlablaManager('message failed');
		controller.render(extendedMessage);
		if(_.isFunction(callbackFn)) callbackFn(extendedMessage);
	};

	controller.source(message, controllerCallback);
}


BlablaManager.prototype.listenNewMessages = function(callbackFn)
{
	var controller = this.getControllers().listenNewMessages;
	var controllerCallback = {};
	var __this = this;

	window.debugBlablaManager('Started listening new messages');

	controllerCallback.success = function(messages){
		if(!__this.getCDS().addMessages(messages)){
			window.debugBlablaManager('Cant add this message');
			return false;
		}

		var extendedMessages = __this.extendMessages(messages);
		window.debugBlablaManager('message received correctly');
		controller.render(extendedMessages);
		if(_.isFunction(callbackFn)) callbackFn(extendedMessages);
	};

	controller.source(controllerCallback);
}

BlablaManager.prototype.stopListenNewMessages = function(callbackFn)
{
	var controller = this.getControllers().stopListenNewMessages;
	controller();
	window.debugBlablaManager('Stopped listening new messages');
	if(_.isFunction(callbackFn)) callbackFn();
}

BlablaManager.prototype.deleteMessage = function(idMessage, callbackFn)
{
	var controllerCallback = {};
	var controller = this.getControllers().deleteMessage;
	var __this = this;

	controllerCallback.success = function(data){
		__this.getCDS().deleteMessage(idMessage);
		window.debugBlablaManager('message removed correctly');
		controller.render({"id": idMessage});
		if(_.isFunction(callbackFn)) callbackFn(data);
	};

	controller.source(idMessage, controllerCallback);
}

BlablaManager.prototype.setConnectionStatus = function(idMember, statusMember, callbackFn)
{
	var controllerCallback = {};
	var controller = this.getControllers().setConnectionStatus;
	var __this = this;

	controllerCallback.success = function(){
		var member = __this.getCDS().setMemberProperties(idMember, {status: statusMember});		
		if(!member){
			window.debugBlablaManager('status cant be changed. Error');
		}
		else{
			controller.render(member);
		}
		
		if(_.isFunction(callbackFn)) callbackFn(member);
	}

	controller.source(idMember, controllerCallback);
}

BlablaManager.prototype.extendMessages = function(messages)
{
	return this._mixMessagesWithMemberProperties(messages);
}

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
		var member = this.getCDS().getMember(messages[i]["idUser"]);
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