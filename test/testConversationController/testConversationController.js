(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define([
        		"jquery", 
        		"underscore", 
        		"../../src/ConversationDataStore", 
        		"../../src/ConversationController"
        		], factory);
    } else if (typeof exports === "object") {
        module.exports = factory(
        						require("jquery"), 
        						require("underscore"), 
        						require("../../src/ConversationDataStore"), 
        						require("../../src/ConversationController")
        						);
    } else {
        root.testConversacionController = factory(root.$, root._, root.ConversationDataStore, root.ConversationController);
    }
}(this, function ($, _, ConversationDataStore, ConversationController) {

window.messages = [
{
	"id": 1455, 
	"idUser": 66, 
	"mensaje": "9 Hola!", 
	"fecha": "14-11-90"
}, 
{
	"id": 1555, 
	"idUser": 55, 
	"mensaje": "10adios!", 
	"fecha": "14-11-90"
},
{
	"id": 15525, 
	"idUser": 55, 
	"mensaje": "11adisdes!", 
	"fecha": "14-11-90"
},
{
	"id": 15535, 
	"idUser": 55, 
	"mensaje": "12afdsos!", 
	"fecha": "14-11-90"
},
{
	"id": 1455555, 
	"idUser": 66, 
	"mensaje": "13Hola!", 
	"fecha": "14-11-90"
}, 
{
	"id": 1553333335, 
	"idUser": 55, 
	"mensaje": "14adios!", 
	"fecha": "14-11-90"
}

];


window.oldMessages = [
{
	"id": 15, 
	"idUser": 66, 
	"mensaje": "viejo mensaje ", 
	"fecha": "14-11-90"
}, 
{
	"id": 16, 
	"idUser": 55, 
	"mensaje": "viejo mensaje!", 
	"fecha": "14-11-90"
},
{
	"id": 17, 
	"idUser": 55, 
	"mensaje": "1viejo mensajes!", 
	"fecha": "14-11-90"
},
{
	"id": 18, 
	"idUser": 55, 
	"mensaje": "1viejo mensaje!", 
	"fecha": "14-11-90"
},
{
	"id": 19, 
	"idUser": 66, 
	"mensaje": "1viejo mensaje!", 
	"fecha": "14-11-90"
}, 
{
	"id": 20, 
	"idUser": 55, 
	"mensaje": "viejo mensajes!", 
	"fecha": "14-11-90"
}

];


window.message = {
	"id": 1455959595959543, 
	"idUser": 66, 
	"mensaje": "MENSAJE ENVIADO POR sentMessage()!", 
	"fecha": "14-11-90"
};

window.members = [
{"id":66,"alias":"Miguel \u00c1ngel","status":0,"p":"","edad":20,"total_fotos":1,"t":"Conectado hace 1 mes","url_perfil":"#perfil\/66","img_perfil":"http:\/\/takingo.com\/api\/img\/galeria\/thumbnail\/13812684742b24d495052a8ce66358eb576b8912c8145.jpeg","c":0,"lista_intereses":[{"id":"848","interes":"\ufeffIntereconom\u00eda","c":"2","cat":"2","t":1,"revisado":1,"delete":0},{"id":"96","interes":"Guitarra \r\n","c":"0","cat":"0","t":0,"revisado":1,"delete":0},{"id":"122","interes":"Escuchar m\u00fasica \r\n","c":"0","cat":"0","t":0,"revisado":1,"delete":0},{"id":"386","interes":"Rock","c":"1","cat":"1","t":0,"revisado":1,"delete":0},{"id":"590","interes":"Nirvana","c":"1","cat":"1","t":0,"revisado":1,"delete":0}]},
{"id":55,"alias":"Paula","status":0,"p":"","edad":19,"total_fotos":9,"t":"Conectado hace 1 mes","url_perfil":"#perfil\/55","img_perfil":"http:\/\/takingo.com\/api\/img\/galeria\/thumbnail\/_520605a5c70156ea04cc6d974e9017306f7d61419218291.jpg","c":0,"lista_intereses":[{"id":"1005","interes":"Maltrato animal","c":"0","cat":"0","t":1,"revisado":1,"delete":0},{"id":"1043","interes":"Angerfist","c":"1","cat":"1","t":0,"revisado":1,"delete":0},{"id":"1051","interes":"Fachas","c":"0","cat":"0","t":1,"revisado":1,"delete":0},{"id":"76","interes":"Electr\u00f3nica \r\n","c":"0","cat":"0","t":0,"revisado":1,"delete":0},{"id":"122","interes":"Escuchar m\u00fasica \r\n","c":"0","cat":"0","t":0,"revisado":1,"delete":0}]},
{"id":28,"alias":"pili","status":0,"p":"valencia","edad":48,"total_fotos":9,"t":"Conectado hace 1 mes","url_perfil":"#perfil\/28","img_perfil":"http:\/\/takingo.com\/api\/img\/galeria\/thumbnail\/1367947747d09bf41544a3365a46c9077ebb5e35c375.jpeg","c":0,"lista_intereses":[{"id":"922","interes":"Cerveza","c":"10","cat":"10","t":0,"revisado":1,"delete":0},{"id":"85","interes":"Acuarios\r\n","c":"0","cat":"0","t":0,"revisado":1,"delete":0},{"id":"939","interes":"Mandar a la mierda a mis hijos","c":"3","cat":"3","t":0,"revisado":1,"delete":0},{"id":"940","interes":"El Fari","c":"1","cat":"1","t":0,"revisado":1,"delete":0}]}
];


var params = {
	idConversation: 10000, 

	onCreateConversation: function(){
		console.log('Conversacion creada (onCreateConversation)');
	}, 
	
	sourceMembers: function(controllerCallback){
		setTimeout(function(){
			controllerCallback.success(window.members);
		}, 100);
	}, 

	sourceMessages: function(controllerCallback){
		setTimeout(function(){
			controllerCallback.success(window.messages);
		}, 100);
	}, 

	sourceConversation: function(controllerCallback){
		setTimeout(function(){
			controllerCallback.success({messages: window.messages, members: window.members});
		}, 100);
	}, 

	sourceSendMessage: function(message, controllerCallback){
		/*
			call controllerCallback.success() function if the message is accepted by your app
			call controllerCallback.fail() function if the message isnt accepted by your app
		*/

		var successWhileSend = true;

		setTimeout(function(){
			var data = {};
			data.message = message;

			if(successWhileSend){		
				data.response = "success";	
				controllerCallback.success(data);
			}
			else{
				data.response = "fail";
				controllerCallback.fail(data);
			}

		}, 100);
	}, 

	sourceDeleteMessage: function(idMessage, controllerCallback){
		/*
			call controllerCallback.success() function if the message can be deleted by your app
		*/
		var successWhileSend = true;

		setTimeout(function(){
			if(successWhileSend){
				controllerCallback.success({response: 'success'});
			}
		}, 100);

	}, 

	sourceKickMember: function(member, controllerCallback){
		/*
			call controllerCallback.success() function if the member can be kicked by your app
		*/
		var successWhileSend = true;

		setTimeout(function(){
			if(successWhileSend){
				controllerCallback.success({member: member, response: 'success'});
			}
		}, 100);

	}, 

	sourceJoinMember: function(member, controllerCallback){
		/*
			call controllerCallback.success() function if the member can join
		*/
		var successWhileSend = true;
		setTimeout(function(){
			if(successWhileSend){
				controllerCallback.success({member: member, response: 'success'});
			}
		}, 100);

	}, 

	sourceImWriting: function(controllerCallback){
		var successWhileSend = true;

		setTimeout(function(){
			if(successWhileSend){
				controllerCallback.success({});
			}
		}, 100);

	}, 

	setConnectionStatus: function(idMember, controllerCallback){

		var successWhileSend = true;

		setTimeout(function(){

			if(successWhileSend){
				controllerCallback.success();
			}
			
		}, 100);

	}, 

	sourceGetPreviousMessages: function(searchData, controllerCallback){
		/*
			
		*/

		var successWhileSend = true;

		var requested_messages = searchData.requested;
		var messages_since = searchData.since;

		setTimeout(function(){

			if(successWhileSend){
				var oldMessages = window.oldMessages;
			}

			controllerCallback.success(oldMessages);
			
		}, 100);
	}

};


cc = new ConversationController(ConversationDataStore, params);

console.log('id conversacion: '+cc.getIdConversation());

cc.fetchDataConversation(function(conversation){

	console.log(cc.getCDS().getMessages());

	cc.sendMessage(message, function(data){
		console.log(data.response);
		console.log(cc.getCDS().getMessages());

		cc.deleteMessage(1455, function(data){
			console.log('deleting a message using the api');
		});
	});


	cc.kickMember(66, function(data){
		
	});


	cc.joinMember({id: 324290314823, alias: 'joinedMember'}, function(data){
		
	});


	cc.sendImWriting(function(data){
		console.log('Sent that im writing');
	});

	cc.setConnectionStatus(28, 'afk', function(data){
		console.log(data);
	});

	cc.getPreviousMessages(10, function(data){
		console.log(data.messages);
		console.log('getting old messages');
	});


});






}));