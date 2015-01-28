var ContactList = ContactList || { Models: {}, Collections: {}, Views: {} };

// create four new empty contact collections
var aliveContacts = new ContactList.Collections.ContactCollection();

var deadContacts = new ContactList.Collections.ContactCollection();

var undeadContacts = new ContactList.Collections.ContactCollection();

var allContacts = new ContactList.Collections.ContactCollection();

// create three new collection list views
var aliveContactListView = new ContactList.Views.ContactListView({
	collection: aliveContacts,
	el: $('.display')
});

var deadContactListView = new ContactList.Views.ContactListView({
	collection: deadContacts,
	el: $('.display')
});

var undeadContactListView = new ContactList.Views.ContactListView({
	collection: undeadContacts,
	el: $('.display')
});

// function to sort into new collections by category id

function sort(data){
	for (var i = 0; i < data.length; i++){
		if (data[i].category_id == 3){
			allContacts.add(aliveContacts.create(data[i]));
		} else if (data[i].category_id == 4){
			allContacts.add(deadContacts.create(data[i]));
		} else {
			allContacts.add(undeadContacts.create(data[i]));
		}
	}
	$(".display").empty();
	$('.display').append($("<h2>Contact Status: Uncertain</h2>"));
}

ContactList.initialize = function(){

	// fetch all contact objects and sort them into three separate collections by category
	$.ajax({
		url: '/contacts',
		type: 'GET',
		dataType: 'json'
	}).done(function(data){
		sort(data);
	})

	// play WD theme on title hover :-)
	var $title = $('h1')
	$title.on('mouseenter', function(){
		document.getElementById("theme").play();
	})

	// search existing contacts and display if contact exists
	var $contactSearch = $('#contactSearch')

	$contactSearch.on('click', function(event){
		event.preventDefault();
		console.log("search submitted")
		var name = $('input[name="contactSearch"]').val();
		var contactToDisplay = _.find(allContacts.models, function(model){
			return model.attributes.name === name
		});
		if (!contactToDisplay){
			alert("That contact does not exist.")
		} else {
			if (contactToDisplay.attributes.category_id === 3){
				var category_name = "Alive"
			} else if (contactToDisplay.attributes.category_id === 4){
				var category_name = "Dead"
			} else {
				var category_name = "Undead"
			}
			$('.display').empty();
			var template = _.template($("#contact-template").html());
			var rendered = template(contactToDisplay.attributes);
			var $showDiv = $("<h2>Status: " + category_name + "</h2><div class='show " + category_name + "'>" + rendered + "</div>")
			$('.display').append($showDiv)
		}
		$('input[name="contactSearch"]').val("");
	});

	// upon clicking alive contacts button, display alive contacts.
	var $showAlive = $('#showAlive')

	$showAlive.on('click', function(){
		aliveContactListView.render();
	})

	// upon clicking dead contacts button, display dead contacts.
	var $showDead = $('#showDead')

	$showDead.on('click', function(){
		deadContactListView.render();
	})

	// upon clicking undead contacts button, display undead contacts.
	var $showUndead = $('#showUndead')

	$showUndead.on('click', function(){
		undeadContactListView.render();
	})

	// upon clicking Create Contact button, show newContact form. Upon submitting form, create new contact model in category collection (and add to complete collection), and render that category to the DOM

	$('#newContact').on('submit', function(event){
		event.preventDefault();
		var name = $('input[name="name"]').val();
		if (name === ""){
			name = prompt("Please enter contact name!");
		}
		var age = $('input[name="age"]').val();
		if (age === ""){				
			age = prompt("Please enter contact age!");
		}
		var address = $('input[name="address"]').val();
		if (address === ""){
			address = prompt("Please enter contact address!");
		}
		var phoneNumber = $('input[name="phoneNumber"]').val();
		if (phoneNumber === "" || phoneNumber.length !== 12){
			phoneNumber = prompt("Please enter a valid phone number with format xxx-xxx-xxxx.");
		}
		var category = $('select').val();
		if (category === "This person is..."){
			alert("Please select contact category.")
		}
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
		$('input[name="name"]').val("").focus();
		$('input[name="age"]').val("");
		$('input[name="address"]').val("");
		$('input[name="phoneNumber"]').val("");
		$('select').val("This person is...");
	});
};

$(function(){

	ContactList.initialize();

})


