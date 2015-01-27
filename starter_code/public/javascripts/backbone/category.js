var ContactList = ContactList || { Models: {}, Collections: {}, Views: {} };

// Category Model: initializes with default new contact collection

ContactList.Models.Category = Backbone.Model.extend({
	initialize: function(){
		console.log("Category created!")
	},

	defaults: {
		name: "",
		collection: new ContactList.Collections.Contact()
	}

});

// Category Collection: consists of category models, and searches '/categories' routes

ContactList.Collections.Category = Backbone.Model.extend({
	model: ContactList.Models.Category,
	url: '/categories'
});

// Category View

ContactList.Views.Category = Backbone.View.extend({
	initialize: function(){
		this.listenTo(this.model, "change", this.render)
	},

	tagName: 'div',
	template: _.template($('#category-template').html()),

	
	render: function(){
		// renders categoryView
		var self = this;
		this.$el.empty();
		this.$el.html(this.template(this.model.attributes));
		
		// renders new contactListView
		var listView = new ContactListView({
			collection: this.model.get('contacts'), el: this.$el.find('.contacts')
		});
		listView.render();

		// find new contact form on categoryView; when it is submitted, add new contact to the view and to the database
		this.$el.find('form').on('submit', function(event){
			event.preventDefault();
			var name = self.$el.find('input[name="name"]').val();
			var age = self.$el.find('input[name="age"]').val();
			var address = self.$el.find('input[name="address"]').val();
			var phoneNumber = self.$el.find('input[name="phoneNumber"]').val();
			var categoryId = self.model.id;
			$.ajax({
				url: 'http://api.randomuser.me/',
				type: 'GET',
  			dataType: 'json'
			}).done(function(data){
				var picture = data.results[0].user.picture.medium
				self.model.get("contacts").create({name: name, age: age, address: address, phone_number: phoneNumber, category_id: categoryId, picture: picture})
			})
		})

		return this
	}

}); 

