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

	this.getControllers = function(){
		return this._controllers;
	}

	this.setCDS(ConversationDataStore);

	if(params.idConversation != null){
		this.setIdConversation(params.idConversation);
	}

	if(params.memberPropertiesToMixWithMessage != null){
		this.setMemberPropertiesToMixWithMessage(params.memberPropertiesToMixWithMessage);
	}

	if(_.isFunction(params.onCreateConversation)){
		this.getControllers().onCreateConversation = params.onCreateConversation;
	}

	if(_.isFunction(params.sourceMembers)){
		this.getControllers().members = params.sourceMembers;
	}

	if(_.isFunction(params.sourceMessages)){
		this.getControllers().messages = params.sourceMessages;
	}

	if(_.isFunction(params.sourceConversation)){
		this.getControllers().conversation = params.sourceConversation;
	}

	if(_.isObject(params.getConversation)){
		this.getControllers().getConversation = params.getConversation;
	}

	if(_.isObject(params.appendNewMessage)){
		this.getControllers().appendNewMessage = params.appendNewMessage;
	}

	if(_.isObject(params.deleteMessage)){
		this.getControllers().deleteMessage = params.deleteMessage;
	}

	if(_.isObject(params.kickMember)){
		this.getControllers().kickMember = params.kickMember;
	}

	if(_.isObject(params.joinMember)){
		this.getControllers().joinMember = params.joinMember;
	}

	if(_.isObject(params.setConnectionStatus)){
		this.getControllers().connectionStatus = params.setConnectionStatus;
	}

	if(_.isObject(params.previousUnloadedMessages)){
		this.getControllers().previousUnloadedMessages = params.previousUnloadedMessages;
	}

	this.onCreateConversation();

}



BlablaManager.prototype.onCreateConversation = function()
{
	var onCreateConversation = this.getControllers().onCreateConversation;
	if(!_.isFunction(onCreateConversation)){
		return false;
	}

	onCreateConversation();
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
	this.getCDS().setIdConversation(idConversation);
}

BlablaManager.prototype.getIdConversation = function()
{
	return this.getCDS().getIdConversation();
}

BlablaManager.prototype.fetchDataConversation = function(callbackFn)
{
	if(!_.isFunction(this.getControllers().conversation)){
		console.error('Must define params.sourceConversation before use fetchDataConversation');
		return false;
	}

	var controllerCallback = {};
	var __this = this;

	controllerCallback.success = function(data){
		if(!_.has(data, "members") || !_.has(data, "messages")){
			console.error('data provided by controllerCallback.success needs members and messages');
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
		console.error('Must define params.sourceMembers before use fetchDataMembers');
		return false;
	}

	var controllerCallback = {};
	var __this = this;

	controllerCallback.success = function(members){
		__this.getCDS().resetMembers();

		if(!__this.getCDS().addMembers(members)){
			console.log('cant add members');
			var members = [];
		}
		
		if(_.isFunction(callbackFn)) callbackFn(members);
	}

	this.getControllers().members(controllerCallback);
}

BlablaManager.prototype.fetchDataMessages = function(callbackFn)
{
	if(!_.isFunction(this.getControllers().messages)){
		console.error('Must define params.sourceMessages before use fetchDataMessages');
		return false;
	}

	var controllerCallback = {};
	var __this = this;

	controllerCallback.success = function(messages){
		__this.getCDS().resetMessages();

		if(!__this.getCDS().addMessages(messages)){
			console.log('cant fetch data messages');
			var messages = [];
		}

		if(_.isFunction(callbackFn)) callbackFn({messages: messages});
	};

	this.getControllers().messages(controllerCallback);
}

BlablaManager.prototype.getConversation = function(callbackFn){
	if(!_.isObject(this.getControllers().getConversation)){
		console.error('Must define params.getConversation before use getConversation');
		return false;
	}

	var controller = this.getControllers().getConversation;
	var controllerCallback = {};

	var existsSavedConversation = this.getCDS().existsSavedConversation();

	if(existsSavedConversation){
		console.log('Accesing conversation from dataStore');
		existsSavedConversation.messages = this.extendMessages(existsSavedConversation.messages);
		controller.render(existsSavedConversation);
		if(_.isFunction(callbackFn)) callbackFn(existsSavedConversation);
	}
	else{
		var __this = this;
		console.log('Accesing conversation from source');
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
		console.error('Must define params.previousUnloadedMessages before use getPreviousUnloadedMessages');
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
			console.log('old messages cant be added');
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
	console.log('kicking member sdfsfds')
	console.log(member)

	var controllerCallback = {};
	var __this = this;

	controllerCallback.success = function(){		
		__this.getCDS().deleteMember(idMember);
		console.log('member kicked correctly');
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
			console.log('member joined correctly');
			controller.render(member);
			if(_.isFunction(callbackFn)) callbackFn(member);
		}
	};

	controller.source(member, controllerCallback);
}

BlablaManager.prototype.appendNewMessage = function(message, callbackFn)
{
	var controller = this.getControllers().appendNewMessage;
	var idMessage = this.getCDS().getIdObject(message);
	var controllerCallback = {};
	var __this = this;

	if(!this.getCDS().addMessages(message)){
		console.error('Cant add this message');
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

		console.log('message sent correctly');
		controller.render(extendedMessage);
		if(_.isFunction(callbackFn)) callbackFn(extendedMessage);
	};

	controllerCallback.fail = function(message){
		__this.getCDS().setMessageFailedToSent(idMessage);
		var message = __this.getCDS().getMessage(idMessage);
		var extendedMessage = __this.extendMessages(message);

		console.error('message failed');
		controller.render(extendedMessage);
		if(_.isFunction(callbackFn)) callbackFn(extendedMessage);
	};

	controller.source(message, controllerCallback);
}

BlablaManager.prototype.deleteMessage = function(idMessage, callbackFn)
{
	var controllerCallback = {};
	var controller = this.getControllers().deleteMessage;
	var __this = this;

	controllerCallback.success = function(data){
		__this.getCDS().deleteMessage(idMessage);
		console.log('message removed correctly');
		controller.render({"id": idMessage});
		if(_.isFunction(callbackFn)) callbackFn(data);
	};

	controller.source(idMessage, controllerCallback);
}

BlablaManager.prototype.setConnectionStatus = function(idMember, statusMember, callbackFn)
{
	var controllerCallback = {};
	var controller = this.getControllers().connectionStatus;
	var __this = this;

	controllerCallback.success = function(){
		var member = __this.getCDS().setMemberProperties(idMember, {status: statusMember});		
		if(!member){
			console.log('status cant be changed. Error');
		}
		else{
			controller.render(member);
		}
		
		if(_.isFunction(callbackFn)) callbackFn(member);
	}

	controller.source(idMember, controllerCallback);
}

BlablaManager.prototype.extendMessages = function(messages){
	return this._mixMessagesWithMemberProperties(messages);
}

BlablaManager.prototype.setMemberPropertiesToMixWithMessage = function(properties){
	if(_.isEmpty(properties)){
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

BlablaManager.prototype.getMemberPropertiesToMixWithMessage = function(){
	return this._memberPropertiesToMixWithMessage;
}

BlablaManager.prototype._getMessageMixedWithMemberProperty = function(message, member, property){
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