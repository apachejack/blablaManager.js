describe("Tests for ConversationDataStore", function(){
	it("A should be equal to B", function(){
		var a = "caca";
		var b = "caca";

		expect(a).toBe(b);
	});

	describe("Tests for store data", function(){
		var CDS;

		beforeEach(function(){
			CDS = new window.ConversationDataStore({
				idConversation: 1
			});
		});

		afterEach(function(){
			CDS = null;
		});

		it("When setConversationId, getConversationId must be an string but with same value", function(){
			var id = 3432423;
			CDS.setIdConversation(id);
			var obtained_id = CDS.getIdConversation();

			expect(CDS.getIdConversation() == id).toBe(true);
			expect(Object.prototype.toString.call(obtained_id)).toBe("[object String]");
		});


		it("deleteAllMessages must delete them", function(){
			var messages;
			CDS.deleteAllMessages();
			messages = CDS.getMessages();
			expect(messages.length).toEqual(0);
		});


		it("message added must be saved and be identical when you get it using getMessages()", function(){
			var new_message = {
				"id": Date.now(), 
				"idUser": 3, 
				"message": "ffadjljflksdjfdklsafjdsl"
			};

			var messages;

			CDS.addMessages(new_message);
			messages = CDS.getMessages();

			expect(Object.prototype.toString.call(messages)).toBe("[object Array]");
			expect(messages.length).toEqual(1);
			expect(messages[0]).toEqual(new_message);
		});


	});

});