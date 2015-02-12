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
	this._source = {};

	this.getSource = function(){
		return this._source;
	}

	this.setCDS(ConversationDataStore);

	if(params.idConversation != null){
		this.setIdConversation(params.idConversation);
	}

	if(_.isFunction(params.onCreateConversation)){
		this.getSource().onCreateConversation = params.onCreateConversation;
	}

	if(_.isFunction(params.sourceMembers)){
		this.getSource().members = params.sourceMembers;
	}

	if(_.isFunction(params.sourceMessages)){
		this.getSource().messages = params.sourceMessages;
	}

	if(_.isFunction(params.sourceConversation)){
		this.getSource().conversation = params.sourceConversation;
	}

	if(_.isFunction(params.sourceSendMessage)){
		this.getSource().sendMessage = params.sourceSendMessage;
	}

	if(_.isFunction(params.sourceDeleteMessage)){
		this.getSource().deleteMessage = params.sourceDeleteMessage;
	}

	if(_.isFunction(params.sourceKickMember)){
		this.getSource().kickMember = params.sourceKickMember;
	}

	if(_.isFunction(params.sourceJoinMember)){
		this.getSource().joinMember = params.sourceJoinMember;
	}

	if(_.isFunction(params.sourceImWriting)){
		this.getSource().imWriting = params.sourceImWriting;
	}

	if(_.isFunction(params.setConnectionStatus)){
		this.getSource().setConnectionStatus = params.setConnectionStatus;
	}

	if(_.isFunction(params.sourcePreviousUnloadedMessages)){
		this.getSource().previousUnloadedMessages = params.sourcePreviousUnloadedMessages;
	}

	this.onCreateConversation();

}

ConversationController.prototype.onCreateConversation = function()
{
	var onCreateConversation = this.getSource().onCreateConversation;
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
	if(!_.isFunction(this.getSource().conversation)){
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

	this.getSource().conversation(controllerCallback);
}

ConversationController.prototype.fetchDataMembers = function(callbackFn)
{
	if(!_.isFunction(this.getSource().members)){
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

	this.getSource().members(controllerCallback);
}

ConversationController.prototype.fetchDataMessages = function(callbackFn)
{
	if(!_.isFunction(this.getSource().messages)){
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

	this.getSource().messages(controllerCallback);
}


ConversationController.prototype.getPreviousUnloadedMessages = function(requested_messages, callbackFn)
{
	if(!_.isFunction(this.getSource().previousUnloadedMessages)){
		console.error('Must define params.sourcePreviousUnloadedMessages before use getPreviousUnloadedMessages');
		return false;
	}

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

		if(_.isFunction(callbackFn)) callbackFn({messages: messages});
	};

	this.getSource().previousUnloadedMessages(searchData, controllerCallback);
}


ConversationController.prototype.kickMember = function(idMember, callbackFn)
{
	var member = this.getCDS().getMember(idMember);
	var controllerCallback = {};
	var __this = this;

	controllerCallback.success = function(data){
		__this.getCDS().deleteMember(idMember);
		console.log('member kicked correctly');
		if(_.isFunction(callbackFn)) callbackFn(data);
	};

	this.getSource().kickMember(member, controllerCallback);
}

ConversationController.prototype.joinMember = function(member, callbackFn)
{
	var controllerCallback = {};
	var __this = this;

	controllerCallback.success = function(data){
		if(__this.getCDS().addMembers(member)){
			console.log('member joined correctly');
			if(_.isFunction(callbackFn)) callbackFn(data);
		}
	};

	this.getSource().joinMember(member, controllerCallback);
}

ConversationController.prototype.sendMessage = function(message, callbackFn)
{
	var idMessage = this.getCDS().getIdObject(message);
	var controllerCallback = {};
	var __this = this;

	if(!this.getCDS().addMessages(message)){
		console.error('Cant add this message');
		return false;
	}

	controllerCallback.success = function(data){
		__this.getCDS().unsetMessageFailedToSent(idMessage);
		console.log('message sent correctly');
		if(_.isFunction(callbackFn)) callbackFn(data);
	};

	controllerCallback.fail = function(data){
		__this.getCDS().setMessageFailedToSent(idMessage);
		console.error('message failed');
		if(_.isFunction(callbackFn)) callbackFn(data);
	};

	this.getSource().sendMessage(message, controllerCallback);
}

ConversationController.prototype.deleteMessage = function(idMessage, callbackFn)
{
	var controllerCallback = {};
	var __this = this;

	controllerCallback.success = function(data){
		__this.getCDS().deleteMessage(idMessage);
		console.log('message removed correctly');
		if(_.isFunction(callbackFn)) callbackFn(data);
	};

	this.getSource().deleteMessage(idMessage, controllerCallback);
}

ConversationController.prototype.sendImWriting = function(callbackFn)
{
	var controllerCallback = {};
	var __this = this;

	controllerCallback.success = function(data){
		if(_.isFunction(callbackFn)) callbackFn(data);
	}

	this.getSource().imWriting(controllerCallback);
}

ConversationController.prototype.setConnectionStatus = function(idMember, statusMember, callbackFn)
{
	var controllerCallback = {};
	var __this = this;

	controllerCallback.success = function(){
		var member = null;

		if(!__this.getCDS().setMemberProperties(idMember, {status: statusMember})){
			console.log('status cant be changed. Error');
		}
		else{
			member = __this.getCDS().getMember(idMember);
		}
		
		if(_.isFunction(callbackFn)) callbackFn({member: member});
	}

	this.getSource().setConnectionStatus(idMember, controllerCallback);
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