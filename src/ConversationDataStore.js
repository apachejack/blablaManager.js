(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['underscore'], factory);
    } else {
        // Browser globals
        root.ConversationDataStore = factory(root._);
    }
}(this, function (_) {

"use strict";

/**
 * Description
 * @class ConversationDS
 * @constructor
 * @param {} params
 * @return 
 */
var ConversationDS = function(params){
	this._messages = [];
	this._members = [];

	if(params.idConversation != null){
		this.setIdConversation(params.idConversation);
	}


}

/**
 * Description
 * @method getIndexById
 * @param {} data
 * @param {} idData
 * @return index
 */
ConversationDS.prototype.getIndexById = function(data, idData){
	var dataLength = data.length;
	var idData = parseInt(idData);
	var index = null;

	for (var i = 0; i < dataLength; i++){ 
		if(data[i]["id"] == idData){
			index = i;
			break;
		}
	}

	return index;
}


/**
 * Description
 * @method setIdConversation
 * @param {} idConversation
 * @return 
 */
ConversationDS.prototype.setIdConversation = function(idConversation){
	this._idConversation = parseInt(idConversation);
}

/**
 * Description
 * @method getIdConversation
 * @return MemberExpression
 */
ConversationDS.prototype.getIdConversation = function(){
	return this._idConversation;
}

/**
 * Description
 * @method getMessages
 * @return MemberExpression
 */
ConversationDS.prototype.getMessages = function(){
	return this._messages;
}

/**
 * Description
 * @method getTotalMessages
 * @return MemberExpression
 */
ConversationDS.prototype.getTotalMessages = function(){
	return this.getMessages().length;
}

/**
 * Description
 * @method getMessage
 * @param {} idMessage
 * @return message
 */
ConversationDS.prototype.getMessage = function(idMessage){
	var message = _.findWhere(this.getMessages(), {id: parseInt(idMessage)});
	return message;
}

/**
 * Description
 * @method deleteAllMessages
 * @return 
 */
ConversationDS.prototype.deleteAllMessages = function(){
	this._messages = [];
}

/**
 * Description
 * @method prependMessages
 * @param {} messages
 * @return Literal
 */
ConversationDS.prototype.prependMessages = function(messages){
	if(!_.isArray(messages)){
		return this._pushMessage(messages, "UNSHIFT");
	}

	var reversedMessages = messages.reverse();
	var messagesLength = reversedMessages.length;
	var unshiftMessage;

	for (var i = 0; i < messagesLength; i++){ 
		unshiftMessage = this._pushMessage(reversedMessages[i], "UNSHIFT");
		if(!unshiftMessage){
			break;
			return false;
		}
	}

	return true;

}

/**
 * Description
 * @method addMessages
 * @param {} messages
 * @return Literal
 */
ConversationDS.prototype.addMessages = function(messages){

	if(!_.isArray(messages)){
		return this._pushMessage(messages);
	}

	var messagesLength = messages.length;
	var pushMessage;

	for (var i = 0; i < messagesLength; i++){ 
		pushMessage = this._pushMessage(messages[i]);
		if(!pushMessage){
			break;
			return false;
		}
	}

	return true;
}


/**
 * Description
 * @method getIdObject
 * @param {} object
 * @return CallExpression
 */
ConversationDS.prototype.getIdObject = function(object){
	if(!_.has(object, "id")){
		console.error('getIdObject just accept objects with id property');
		return false;
	}

	return parseInt(object.id);
}

ConversationDS.prototype._validateMessage = function(message){
	//solo se pueden introducir objetos que tengan la propiedad id

	if(!this._validateObjectItem(message)){
		alert("just can add objects with id property");
		return false;
	}

	if(!_.has(message, "idUser")){
		alert("just can add objects with idUser property");
		return false;
	}

	return true;
}

ConversationDS.prototype._pushMessage = function(message, insertMethod){
	if(!this._validateMessage(message)) return false;
	var insertMethod = ((insertMethod == null) ? "PUSH" : insertMethod);

	if(this.getMessage(message.id) != undefined){
		console.error('cant add messages with repeated id');
		return false;
	}

	if(insertMethod == "PUSH"){
		return this._messages.push(message);
	}
	else if(insertMethod == "UNSHIFT"){
		return this._messages.unshift(message);
	}
	
}


/**
 * Description
 * @method getMembers
 * @return MemberExpression
 */
ConversationDS.prototype.getMembers = function(){
	return this._members;
}

/**
 * Description
 * @method getMember
 * @param {} idMember
 * @return member
 */
ConversationDS.prototype.getMember = function(idMember){
	var member = _.findWhere(this.getMembers(), {id: parseInt(idMember)});
	return member;
}

/**
 * Description
 * @method addMembers
 * @param {} members
 * @return Literal
 */
ConversationDS.prototype.addMembers = function(members){

	if(!_.isArray(members)){
		return this._pushMember(members);
	}

	for (var i = 0; i < members.length; i++){ 
		if(!this._pushMember(members[i])){
			break;
			return false;
		}
	}

	return true;
}

/**
 * Description
 * @method setMemberProperties
 * @param {} idMember
 * @param {} properties
 * @return 
 */
ConversationDS.prototype.setMemberProperties = function(idMember, properties){
	/*
	returns a member object with the new properties
	*/

	var memberObject;
	var index;

	if(!_.isObject(properties)){
		alert('properties must be an object');
		return false;
	}


	members = this.getMembers();
	index = this.getIndexById(members, idMember);

	if(index != null){
		memberObject = members[index];
		_.extend(memberObject, properties);
		if(this._replaceListItemWithObject(this._members, index, memberObject)){
			return memberObject;
		}
	}
	else{
		alert('doesnt exists a member with that idMember');
		return false;
	}
}

ConversationDS.prototype._replaceListItemWithObject = function(array, index, object){
	if(!_.isObject(object)){
		return false;
		alert('object must be an object');
	}

	if(!_.isArray(array)){
		return false;
		alert('array must be an array');
	}

	if(!_.isNumber(index)){
		return false;
		alert('index must be a number');
	}

	if(array[index] != null){
		array[index] = object;
		return true;
	}
	else{
		alert('doesnt exists any item with that index');
		return false;
	}
	
}

/**
 * Description
 * @method setMessageProperties
 * @param {} idMessage
 * @param {} properties
 * @return 
 */
ConversationDS.prototype.setMessageProperties = function(idMessage, properties){
	/*
	returns a message object with the new properties
	*/
	var messageObject;
	var index;
	var messages;

	if(!_.isObject(properties)){
		alert('properties must be an object');
		return false;
	}

	messages = this.getMessages();
	index = this.getIndexById(messages, idMessage);

	if(index != null){
		messageObject = messages[index];
		_.extend(messageObject, properties);
		if(this._replaceListItemWithObject(this._messages, index, messageObject)){
			return messageObject;
		}
	}
	else{
		alert('doesnt exists a message with that id');
		return false;
	}
}


/**
 * Description
 * @method setMessageFailedToSent
 * @param {} idMessage
 * @return CallExpression
 */
ConversationDS.prototype.setMessageFailedToSent = function(idMessage){
	return this.setMessageProperties(idMessage, {failedToSent: true});
}

/**
 * Description
 * @method unsetMessageFailedToSent
 * @param {} idMessage
 * @return CallExpression
 */
ConversationDS.prototype.unsetMessageFailedToSent = function(idMessage){
	return this.setMessageProperties(idMessage, {failedToSent: false});
}

ConversationDS.prototype._validateObjectItem = function(object){
	//solo se pueden introducir objetos que tengan la propiedad id

	if(!_.has(object, "id")){
		alert("just can add objects with id property");
		return false;
	}

	return true;
}


ConversationDS.prototype._validateMember = function(member){
	//solo se pueden introducir objetos que tengan la propiedad id

	if(!this._validateObjectItem(member)){
		alert("just can add objects with id property");
		return false;
	}

	if(!_.has(member, "status")){
		alert("just can add members with status property");
		return false;
	}

	return true;
}

ConversationDS.prototype._pushMember = function(member){
	if(!this._validateObjectItem(member)) return false;

	if(this.getMember(member.id) != undefined){
		console.error('cant exists members with repeated ids');
		return false;
	}

	return this._members.push(member);
}

/**
 * Description
 * @method resetMembers
 * @return 
 */
ConversationDS.prototype.resetMembers = function(){
	this._members = [];
}

ConversationDS.prototype._setMembers = function(members){
	this._members = members;
}

/**
 * Description
 * @method resetMessages
 * @return 
 */
ConversationDS.prototype.resetMessages = function(){
	this._messages = [];
}

/**
 * Description
 * @method deleteMember
 * @param {} idMember
 * @return Literal
 */
ConversationDS.prototype.deleteMember = function(idMember){
	var members = this.getMembers();
	var index = this.getIndexById(members, idMember);

	if(index != null){
		members.splice(index, 1);
		this._members = members;
		return true;
	}
	else{
		alert('doesnt exists any member with this id');
	}

	return false;
}


/**
 * Description
 * @method deleteMessage
 * @param {} idMessage
 * @return Literal
 */
ConversationDS.prototype.deleteMessage = function(idMessage){
	var messages = this.getMessages();
	var index = this.getIndexById(messages, idMessage);

	if(index != null){
		messages.splice(index, 1);
		this._messages = messages;
		return true;
	}
	else{
		alert('doesnt exists any message with this id');
	}

	return false;
}

/**
 * Description
 * @method deleteAllMessages
 * @return 
 */
ConversationDS.prototype.deleteAllMessages = function(){
	this._messages = [];
}



/**
 * Description
 * @method getSavedConversation
 * @return ObjectExpression
 */
ConversationDS.prototype.getSavedConversation = function(){
	return {
		"messages": this.getMessages(), 
		"members": this.getMembers()
	}
}

/**
 * Description
 * @method existsSavedConversation
 * @return savedConversation
 */
ConversationDS.prototype.existsSavedConversation = function(){
	var savedConversation = this.getSavedConversation();
	if(!savedConversation.messages.length && !savedConversation.members.length){
		return false;
	}

	return savedConversation;
}

return ConversationDS;

}));