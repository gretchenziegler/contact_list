var ContactList = ContactList || { Models: {}, Collections: {}, Views: {} };

var aliveContacts = new ContactList.Collections.ContactCollection();

var deadContacts = new ContactList.Collections.ContactCollection();

var undeadContacts = new ContactList.Collections.ContactCollection();

var aliveContactListView = new ContactList.Views.ContactListView({
		collection: aliveContacts,
		el: $('.alive')
	});

var deadContactListView = new ContactList.Views.ContactListView({
		collection: deadContacts,
		el: $('.dead')
	})

var undeadContactListView = new ContactList.Views.ContactListView({
		collection: undeadContacts,
		el: $('.undead')
	})

// function to sort into new collections by category id

function sort(data){
	for (var i = 0; i < data.length; i++){
		if (data[i].category_id == 3){
			aliveContacts.create(data[i]);
		} else if (data[i].category_id == 4){
			deadContacts.create(data[i]);
		} else {
			undeadContacts.create(data[i]);
		}
	}
}

ContactList.initialize = function(){

	$.ajax({
		url: '/contacts',
		type: 'GET',
		dataType: 'json'
	}).done(function(data){
		sort(data);
	})

	$('#newContact').on('submit', function(event){
		event.preventDefault();
		var name = $('input[name="name"]').val();
		var age = $('input[name="age"]').val();
		var address = $('input[name="address"]').val();
		var phoneNumber = $('input[name="phoneNumber"]').val();
		var category = $('select').val();
		$.ajax({
			url: 'http://api.randomuser.me/',
			type: 'GET',
  		dataType: 'json'
		}).done(function(data){
			var picture = data.results[0].user.picture.medium
			if (category === "Alive"){
				var categoryId = 3
				aliveContacts.create({name: name, age: age, address: address, phone_number: phoneNumber, category_id: categoryId, picture: picture})
			} else if (category === "Dead"){
				var categoryId = 4
				deadContacts.create({name: name, age: age, address: address, phone_number: phoneNumber, category_id: categoryId, picture: picture})
			} else {
				var categoryId = 5
				undeadContacts.create({name: name, age: age, address: address, phone_number: phoneNumber, category_id: categoryId, picture: picture})
			};
		})
	})
};

$(function(){

	ContactList.initialize();

})


