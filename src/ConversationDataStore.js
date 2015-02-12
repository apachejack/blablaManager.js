(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['underscore'], factory);
    } else {
        // Browser globals
        root.ConversationDataStore = factory(root._);
    }
}(this, function (_) {

var ConversationDS = function(params){
	this._messages = [];
	this._members = [];

	if(params.idConversation != null){
		this.setIdConversation(params.idConversation);
	}


}

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


ConversationDS.prototype.setIdConversation = function(idConversation){
	this._idConversation = parseInt(idConversation);
}

ConversationDS.prototype.getIdConversation = function(){
	return this._idConversation;
}

ConversationDS.prototype.getMessages = function(){
	return this._messages;
}

ConversationDS.prototype.getTotalMessages = function(){
	return this.getMessages().length;
}

ConversationDS.prototype.getMessage = function(id){
	var index = this.getIndexById(this.getMessages(), id);
	var message = ((index != null) ? message[index] : null);
	return message;
}

ConversationDS.prototype.deleteAllMessages = function(){
	this._messages = [];
}

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

	if(this.getIndexById(this.getMessages(), message.id) == null){
		if(insertMethod == "PUSH"){
			return this._messages.push(message);
		}
		else if(insertMethod == "UNSHIFT"){
			return this._messages.unshift(message);
		}
	}
	else{
		alert('cant add messages with repeated id');
	}

	
	return false;
}


ConversationDS.prototype.getMembers = function(){
	return this._members;
}

ConversationDS.prototype.getMember = function(idMember){
	var members = this.getMembers();
	var index = this.getIndexById(members, idMember);
	var member = ((index != null) ? members[index] : null);
	return member;
}
	


ConversationDS.prototype.addMembers = function(members){

	if(!_.isArray(members)){
		return this._pushMember(members);
	}

	for (var i = 0; i < members.length; i++){ 
		if(!this._pushMember(members[i])){

		}
	}
}

ConversationDS.prototype.setMemberProperties = function(idMember, properties){
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
		return this._replaceListItemWithObject(this._members, index, memberObject);
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

ConversationDS.prototype.setMessageProperties = function(idMessage, properties){
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
		return this._replaceListItemWithObject(this._messages, index, messageObject);
	}
	else{
		alert('doesnt exists a message with that id');
		return false;
	}
}


ConversationDS.prototype.setMessageFailedToSent = function(idMessage){
	return this.setMessageProperties(idMessage, {failedToSent: true});
}

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

	if(this.getIndexById(this.getMembers(), member.id) == null){
		return this._members.push(member);
	}
	else{
		alert('No puede haber miembros con ids repetidos');
	}
	
	return false;
}

ConversationDS.prototype.resetMembers = function(){
	this._members = [];
}

ConversationDS.prototype._setMembers = function(members){
	this._members = members;
}

ConversationDS.prototype.resetMessages = function(){
	this._messages = [];
}



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

ConversationDS.prototype.deleteAllMessages = function(){
	this._messages = [];
}



ConversationDS.prototype.getSavedConversation = function(){
	return {
		"messages": this.getMessages(), 
		"members": this.getMembers()
	}
}

return ConversationDS;

}));