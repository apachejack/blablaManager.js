(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define([
        		"jquery", 
        		"underscore", 
        		"mustache", 
        		"../../src/BlablaManager"
        		], factory);
    } else if (typeof exports === "object") {
        module.exports = factory(
        						require("jquery"), 
        						require("underscore"), 
        						require("mustache"), 
        						require("../../src/BlablaManager")
        						);
    } else {
        root.testConversacionController = factory(root.$, root._, root.Mustache, root.BlablaManager);
    }
}(this, function ($, _, Mustache, BlablaManager) {

window.DEBUG_BLABLAMANAGER = true;


window.generateNewMessage = function(){
	var justone = true;

	if(justone){
		return {
			"id": _.now(), 
			"idUser": 66, 
			"mensaje": "soy muy nuevo nuevo nuevo!", 
			"fecha": "14-11-90"
		}
	}
	else{
		return [
			{
				"id": _.now(), 
				"idUser": 66, 
				"mensaje": "soy muy nuevo nuevo nuevo!", 
				"fecha": "14-11-90"
			}, 
			{
				"id": _.now()+30, 
				"idUser": 66, 
				"mensaje": "soy muy nuevo nuevo nuevo!", 
				"fecha": "14-11-90"
			}
		];
	}
};

setInterval(function(){
	$(document).trigger("message-received.chat", window.generateNewMessage());
}, 2000);


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
	"id": 9, 
	"idUser": 66, 
	"mensaje": "viejo mensaje ", 
	"fecha": "14-11-90"
}, 
{
	"id": 10, 
	"idUser": 55, 
	"mensaje": "viejo mensaje!", 
	"fecha": "14-11-90"
},
{
	"id": 11, 
	"idUser": 55, 
	"mensaje": "1viejo mensajes!", 
	"fecha": "14-11-90"
},
{
	"id": 12, 
	"idUser": 66, 
	"mensaje": "viejo mensaje ", 
	"fecha": "14-11-90"
}, 
{
	"id": 13, 
	"idUser": 55, 
	"mensaje": "viejo mensaje!", 
	"fecha": "14-11-90"
},
{
	"id": 14, 
	"idUser": 55, 
	"mensaje": "1viejo mensajes!", 
	"fecha": "14-11-90"
},
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
	"fecha": "14-11-90", 
	"waiting": true
};

window.members = [
{"id":66,"alias":"Miguel \u00c1ngel","status":0,"p":"","edad":20,"total_fotos":1,"t":"Conectado hace 1 mes","url_perfil":"#perfil\/66","img_perfil":"http:\/\/takingo.com\/api\/img\/galeria\/thumbnail\/13812684742b24d495052a8ce66358eb576b8912c8145.jpeg","c":0,"lista_intereses":[{"id":"848","interes":"\ufeffIntereconom\u00eda","c":"2","cat":"2","t":1,"revisado":1,"delete":0},{"id":"96","interes":"Guitarra \r\n","c":"0","cat":"0","t":0,"revisado":1,"delete":0},{"id":"122","interes":"Escuchar m\u00fasica \r\n","c":"0","cat":"0","t":0,"revisado":1,"delete":0},{"id":"386","interes":"Rock","c":"1","cat":"1","t":0,"revisado":1,"delete":0},{"id":"590","interes":"Nirvana","c":"1","cat":"1","t":0,"revisado":1,"delete":0}]},
{"id":55,"alias":"Paula","status":0,"p":"","edad":19,"total_fotos":9,"t":"Conectado hace 1 mes","url_perfil":"#perfil\/55","img_perfil":"http:\/\/takingo.com\/api\/img\/galeria\/thumbnail\/_520605a5c70156ea04cc6d974e9017306f7d61419218291.jpg","c":0,"lista_intereses":[{"id":"1005","interes":"Maltrato animal","c":"0","cat":"0","t":1,"revisado":1,"delete":0},{"id":"1043","interes":"Angerfist","c":"1","cat":"1","t":0,"revisado":1,"delete":0},{"id":"1051","interes":"Fachas","c":"0","cat":"0","t":1,"revisado":1,"delete":0},{"id":"76","interes":"Electr\u00f3nica \r\n","c":"0","cat":"0","t":0,"revisado":1,"delete":0},{"id":"122","interes":"Escuchar m\u00fasica \r\n","c":"0","cat":"0","t":0,"revisado":1,"delete":0}]},
{"id":28,"alias":"pili","status":0,"p":"valencia","edad":48,"total_fotos":9,"t":"Conectado hace 1 mes","url_perfil":"#perfil\/28","img_perfil":"http:\/\/takingo.com\/api\/img\/galeria\/thumbnail\/1367947747d09bf41544a3365a46c9077ebb5e35c375.jpeg","c":0,"lista_intereses":[{"id":"922","interes":"Cerveza","c":"10","cat":"10","t":0,"revisado":1,"delete":0},{"id":"85","interes":"Acuarios\r\n","c":"0","cat":"0","t":0,"revisado":1,"delete":0},{"id":"939","interes":"Mandar a la mierda a mis hijos","c":"3","cat":"3","t":0,"revisado":1,"delete":0},{"id":"940","interes":"El Fari","c":"1","cat":"1","t":0,"revisado":1,"delete":0}]}
];


var params = {
	idConversation: 10000, 

	memberPropertiesToMixWithMessage: ["alias", "img_perfil"], 

	onCreateConversation: function(BlablaManager){
		BlablaManager.listenNewMessages();
	},
	sourceMembers: function(controllerCallback){
		setTimeout(function(){
			controllerCallback.success(window.members);
		}, 600);
	}, 
	sourceMessages: function(controllerCallback){
		setTimeout(function(){
			controllerCallback.success(window.messages);
		}, 600);
	}, 
	getConversation: {
		source: function(controllerCallback){
			setTimeout(function(){
				controllerCallback.success({messages: window.messages, members: window.members});
			}, 600);
		},
		render: function(conversation){
			var tmplConversation = $("#conversation-template").html();
			var data = conversation;
			var partials = {
				message: $("#message-template").html(),
				member: $("#member-template").html()
			}
			var tmpl = Mustache.render(tmplConversation, data, partials);
			$("#chat").html(tmpl);
		}
	}, 
	sendNewMessage: {
		source: function(message, controllerCallback){
			var successWhileSend = true;
			setTimeout(function(){
				message.waiting = false;

				if(successWhileSend){		
					controllerCallback.success(message);
				}
				else{
					controllerCallback.fail(message);
				}
			}, 600);

		}, 
		render: function(message){
			var tmplMessage = $("#message-template").html();
			if(!$("#message-"+message.id).length){
				var tmpl = Mustache.render("<div id='message-{{id}}'>{{>message}}</div>", message, {message: tmplMessage});
				$("#chatbox").append(tmpl);
			}
			else{
				var tmpl = Mustache.render(tmplMessage, message);
				$("#message-"+message.id).html(tmpl);
			}
		}
	}, 

	listenNewMessages: {
		source: function(controllerCallback){
			/*
			var listening = setInterval(function(){
				if(window.generateNewMessage()){
					controllerCallback.success(window.generateNewMessage());
				}
			}, 7000);
			*/

			var messageReceived = function(event, datos){
				controllerCallback.success(datos);
			};

			$(document).off("message-received.chat", messageReceived);
			$(document).on("message-received.chat", messageReceived);
		}, 
		render: function(message){
			var tmplMessage = $("#message-template").html();
			if(!$("#message-"+message.id).length){
				var tmpl = Mustache.render("<div id='message-{{id}}'>{{>message}}</div>", message, {message: tmplMessage});
				$("#chatbox").append(tmpl);
			}
			else{
				var tmpl = Mustache.render(tmplMessage, message);
				$("#message-"+message.id).html(tmpl);
			}
		}
	}, 

	stopListenNewMessages: function(){
		$(document).off("message-received.chat");
	}, 

	deleteMessage: {
		source: function(idMessage, controllerCallback){
			var successWhileSend = true;

			setTimeout(function(){
				if(successWhileSend){
					controllerCallback.success({response: 'success'});
				}
			}, 600);

		}, 
		render: function(data){
			$("#message-"+data.id).remove();
		}
	},
	kickMember: {
		source: function(member, controllerCallback){
			var successWhileSend = true;

			setTimeout(function(){
				if(successWhileSend){
					controllerCallback.success();
				}
			}, 600);

		}, 
		render: function(member){
			$("[data-member='"+member.id+"']").fadeOut(1000, function(){
				$(this).remove();
			});
		}
	}, 
	joinMember:{
		source: function(member, controllerCallback){
			/*
				call controllerCallback.success() function if the member can join
			*/
			var successWhileSend = true;
			setTimeout(function(){
				if(successWhileSend){
					controllerCallback.success(member);
				}
			}, 600);

		}, 
		render: function(member){
			var tmplWrapper = $("#member-wrapper-template").html();
			var tmplMember = $("#member-template").html();
			var tmpl = Mustache.render(tmplWrapper, member, {member: tmplMember});
			$("#members").append(tmpl);
		}
	}, 
	setConnectionStatus: {
		source: function(idMember, controllerCallback){
			var successWhileSend = true;
			setTimeout(function(){
				if(successWhileSend){
					controllerCallback.success();
				}
				
			}, 600);
		}, 
		render: function(member){
			var tmplMember = $("#member-template").html();
			$("[data-member='"+member.id+"']")
				.html(Mustache.render(tmplMember, member));
		}
	}, 
	previousUnloadedMessages: {
		source: function(searchData, controllerCallback){
			var successWhileSend = true;
			var requested_messages = searchData.requested;
			var messages_since = searchData.since;

			setTimeout(function(){
				if(successWhileSend){
					var oldMessages = _.last(window.oldMessages, requested_messages);
				}
				controllerCallback.success(oldMessages);
			}, 600);
		}, 
		render: function (data) {
			var messages = {messages: data};
			console.log('rendering previousUnloadedMessages');
			//console.log(messages);

			//console.log('now show all messages after rendering previousUnloadedMessages');
			//console.log(blabla.getCDS().getMessages());
			var tmplMessage = $("#message-template").html();
			var tmpl = Mustache.render("{{#messages}}<div id='message-{{id}}'>{{>message}}</div>{{/messages}}", messages, {message: tmplMessage});
			$("#chatbox").prepend(tmpl);			
		}
	}
};


function listeners(){
	$("#formtextarea").on("submit", function(e){
		e.preventDefault();
		var $fieldMessage = $(this).find("[name='message']");
		var textMessage = $fieldMessage.val();
		var message = {
			mensaje: textMessage, 
			id: _.now(), 
			idUser: 28, 
			fecha: _.now(), 
			waiting: true
		}

		blabla.sendNewMessage(message);
		$fieldMessage.val("");
	});

	$("#form-add-members").on("submit", function(e){
		e.preventDefault();
		var member = {
			id: $(this).find("[name='id']").val(), 
			alias: $(this).find("[name='alias']").val(), 
			status: $(this).find("[name='status']").val()
		};
		blabla.joinMember(member);
	});

	$("#form-kick-members").on("submit", function(e){
		e.preventDefault();
		var idMember = $(this).find("[name='id']").val();
		blabla.kickMember(idMember);
	});


	blabla = new BlablaManager(params);

	//console.log('id conversacion: '+blabla.getIdConversation());

	blabla.loadConversation(function(conversation){

		//console.log(blabla.getCDS().getMessages());

		//blabla.stopListenNewMessages();

		blabla.sendNewMessage(message, function(message){
			var idMessageSent = message.id;
			//console.log(data.response);
			//console.log(blabla.getCDS().getMessages());

			/*
			blabla.deleteMessage(idMessageSent, function(data){
				//console.log('deleting a message using the api');
			});
			*/

		});


		blabla.kickMember(66, function(member){
			
		});


		blabla.joinMember({id: 324290314823, alias: 'joinedMember'}, function(member){
			
		});

		blabla.joinMember({id: 324290314823333, alias: 'otherjoinedMember', status: 'offline'}, function(member){
			//blabla.kickMember(member.id);
			blabla.setConnectionStatus(member.id, "online", function(member){
				setTimeout(function(){
					blabla.setConnectionStatus(member.id, "afk");
				}, 3000);
			});
		});

		blabla.setConnectionStatus(28, 'afk', function(data){
			//console.log(data);
		});

		blabla.getPreviousUnloadedMessages(5, function(messages){
			//console.log(messages);
			//console.log('getting old messages');
		});


		//console.log('getting message');
		//console.log(blabla.getCDS().getMessage(1455));

		/*
		blabla.loadConversation(function(conversation){
			alert('imprimida de nuevo');
		});
		*/


	});


}

$(document).ready(listeners);



}));