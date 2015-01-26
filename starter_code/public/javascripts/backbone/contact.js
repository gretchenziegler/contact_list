var ContactList = ContactList || { Models: {}, Collections: {}, Views: {} };

// *****Contact Model*****
ContactList.Models.Contact = Backbone.Model.extend({
	initialize: function(){
		console.log("A new contact has been added!")
	},

	defaults: {
		name: "Joe",
		age: 35,
		address: "152 Miranda Way",
		phone_number: "203-215-3423",
		picture: "http://www.washingtonindependentreviewofbooks.com/images/made/aadc04afc622ccbb/gollum_395_394.jpg",
		category_id: 5,
	}
});

// *****Contact Collection*****
ContactList.Collections.ContactCollection = Backbone.Collection.extend({
	model: ContactList.Models.Contact,
	url: "/contacts",
});

// *****Contact View*****
// If the contact this view is listening to changes or is destroyed, it will render or remove itself accordingly.
ContactList.Views.ContactView = Backbone.View.extend({
	initialize: function(){
		this.listenTo(this.model, "change", this.render)
		this.listenTo(this.model, "destroy", this.remove)
	},

	// Contact view will be wrapped in a div tag, and automatically rendered in the contact-template
	tagName: "div",
	template: _.template($('#contact-template').html()),
	editTemplate: _.template($('#contact-edit-template').html()),

	// If the edit button is clicked, the edit template will render instead.
	events: {
		'click [data-action="destroy"]': 'destroyContact',
		'click [data-action="edit"]': 'renderEditForm',
	},

	// The render function, which empties the current div and then adds the template with the latest contact attributes
	render: function(){
		this.$el.empty();
		this.$el.html(this.template(this.model.attributes));
		return this
	},

	// The render edit function, which renders the edit form, then takes the form info and saves it to the database and updates the contact View in the DOM
	renderEditForm: function(){
		var self = this;
		this.$el.html(this.editTemplate(this.model.attributes));
		var button = this.$el.find('#submit')
		button.on('click', function(event){
			console.log('changes submitted');
			event.preventDefault();
			var name = self.$el.find('input[name="name"]').val();
			var picture = self.$el.find('input[name="picture"]').val();
			var age = self.$el.find('input[name="age"]').val();
			var address = self.$el.find('input[name="address"]').val();
			var phoneNumber = self.$el.find('input[name="phoneNumber"]').val();
			var category = self.$el.find('select').val();
			if (category === "Alive"){
				var categoryId = 3
			} else if (category === "Dead"){
				var categoryId = 4
			} else {
				var categoryId = 5
			};
			// update function depending on collection; will move to another category if categoryId is changed
			if (categoryId === self.model.attributes.category_id){
				self.model.set('name', name);
				self.model.set('picture', picture);
				self.model.set('age', age);
				self.model.set('address', address);
				self.model.set('phone_number', phoneNumber);
				self.model.set('category_id', categoryId);
				self.model.save();
			} else if (categoryId === 3){
				aliveContacts.create({name: name, age: age, address: address, phone_number: phoneNumber, category_id: categoryId, picture: picture});
				self.model.destroy();
			} else if (categoryId === 4){
				deadContacts.create({name: name, age: age, address: address, phone_number: phoneNumber, category_id: categoryId, picture: picture});
				self.model.destroy();
			} else {
				undeadContacts.create({name: name, age: age, address: address, phone_number: phoneNumber, category_id: categoryId, picture: picture});
				self.model.destroy();
			};
		});
		// on cancel button, will re-render itself without changing information
		this.$el.find('#cancel').on('click', function(event){
			event.preventDefault();
			self.render();
		})
	},

	destroyContact: function(event){
		event.preventDefault();
		this.model.destroy();
	}
});

// Contact List View

ContactList.Views.ContactListView = Backbone.View.extend({
	initialize: function(){
		this.listenTo(this.collection, 'add', this.render);
	},

	render: function(){
		var self = this;
		this.$el.empty();
		_.each(this.collection.models, function(contact){
			var contactView = new ContactList.Views.ContactView({model: contact});
			self.$el.append( contactView.render().el)
		})
		return this
	}
});
