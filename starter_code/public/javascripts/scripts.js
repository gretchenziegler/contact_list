var ContactList = ContactList || { Models: {}, Collections: {}, Views: {} };

// On load, what needs to happen?
// need to get all contact collections from the database

var collection = new ContactList.Collections.Category();

ContactList.initialize = function(){
	// create new category collection
	// collection = new ContactList.Collections.Category();

	// fetch all categories
	collection.fetch();

	// var alive = new ContactList.Models.Category({name: "alive"});

	// var dead = new ContactList.Models.Category({name: "dead"});

	// var undead = new ContactList.Models.Category({name: "undead"});

	// var aliveView = new ContactList.Views.Category({model: alive, el: $('#alive')});

	// var deadView = new ContactList.Views.Category({model: dead, el: $('#dead')});

	// var undeadView = new ContactList.Views.Category({model: undead, el: $('#undead')}); 

};

// $(function(){

// 	ContactList.initialize();

// });