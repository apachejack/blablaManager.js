(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['underscore'], factory);
    } else {
        // Browser globals
        root.ConversationController = factory(root._);
    }
}(this, function (_) {

var ConversationController = function(ConversationDataStore, params){
	this._ConversationDataStore = null;
	this._controllers = {};

	this.getControllers = function(){
		return this._controllers;
	}

	this.setCDS(ConversationDataStore);

	if(params.idConversation != null){
		this.setIdConversation(params.idConversation);
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

ConversationController.prototype.onCreateConversation = function()
{
	var onCreateConversation = this.getControllers().onCreateConversation;
	if(!_.isFunction(onCreateConversation)){
		return false;
	}

	onCreateConversation();
}


ConversationController.prototype.setCDS = function(CDS)
{
	this._ConversationDataStore = new CDS({});
}

ConversationController.prototype.getCDS = function()
{
	return this._ConversationDataStore;
}

ConversationController.prototype.setIdConversation = function(idConversation)
{
	this.getCDS().setIdConversation(idConversation);
}

ConversationController.prototype.getIdConversation = function()
{
	return this.getCDS().getIdConversation();
}

ConversationController.prototype.fetchDataConversation = function(callbackFn)
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

ConversationController.prototype.fetchDataMembers = function(callbackFn)
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

ConversationController.prototype.fetchDataMessages = function(callbackFn)
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

ConversationController.prototype.getConversation = function(callbackFn){
	if(!_.isObject(this.getControllers().getConversation)){
		console.error('Must define params.getConversation before use getConversation');
		return false;
	}

	var controller = this.getControllers().getConversation;
	var controllerCallback = {};

	var existsSavedConversation = this.getCDS().existsSavedConversation();

	if(existsSavedConversation){
		console.log('Accesing conversation from dataStore');
		controller.render(existsSavedConversation);
		if(_.isFunction(callbackFn)) callbackFn(existsSavedConversation);
	}
	else{
		console.log('Accesing conversation from source');
		this.fetchDataConversation(function(conversation){
			controller.render(conversation);
			if(_.isFunction(callbackFn)) callbackFn(conversation);
		});
	}

}


ConversationController.prototype.getPreviousUnloadedMessages = function(requested_messages, callbackFn)
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

		controller.render(messages.reverse());

		if(_.isFunction(callbackFn)) callbackFn({messages: messages});
	};

	controller.source(searchData, controllerCallback);
}


ConversationController.prototype.kickMember = function(idMember, callbackFn)
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

ConversationController.prototype.joinMember = function(member, callbackFn)
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

ConversationController.prototype.appendNewMessage = function(message, callbackFn)
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
	controller.render(message);

	controllerCallback.success = function(message){
		__this.getCDS().unsetMessageFailedToSent(idMessage);
		var message = __this.getCDS().getMessage(idMessage);

		console.log('message sent correctly');
		controller.render(message);
		if(_.isFunction(callbackFn)) callbackFn(message);
	};

	controllerCallback.fail = function(message){
		__this.getCDS().setMessageFailedToSent(idMessage);
		var message = __this.getCDS().getMessage(idMessage);

		console.error('message failed');
		controller.render(message);
		if(_.isFunction(callbackFn)) callbackFn(message);
	};

	controller.source(message, controllerCallback);
}

ConversationController.prototype.deleteMessage = function(idMessage, callbackFn)
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

ConversationController.prototype.setConnectionStatus = function(idMember, statusMember, callbackFn)
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


ConversationController.prototype.getMixOfMessagesWithMembers = function()
{
	var savedConversation = this.getCDS().getSavedConversation();
	var messages = savedConversation.messages;
	var members = savedConversation.members;

	var messagesLength = messages.length;
	var messagesMixed = [];

	for(var i = 0; i < messagesLength; i++){
		idUser = messages[i]["idUser"];
		indexUser = this.getCDS().getIndexById(members, idUser);

		if(indexUser == null){
			aliasUser = "Desconocido";
		}
		else{
			aliasUser = members[indexUser]["alias"];
		}

		var dataMessage = {
			"alias": aliasUser
		}
		_.extend(dataMessage, messages[i]);

		messagesMixed.push(dataMessage);
	}

	return messagesMixed;
}

return ConversationController;

}));