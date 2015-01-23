require 'sinatra'
require_relative './db/connection'
require_relative './lib/category'
require_relative './lib/contact'
require 'active_support'

after do
  ActiveRecord::Base.connection.close
end

before do
  content_type :json
end

get("/") do
  content_type :html
  File.read( File.expand_path("../views/index.html", __FILE__) )
end

# get all categories, return as json string
get("/categories") do
  Category.all.to_json
end

# get one category by id; will also return all contacts with the category id
get("/categories/:id") do
  Category.find(params[:id]).to_json(:include => :contacts)
end

# create a new category...but why? there are three upon instantiation, and none of these three will change
post("/categories") do
  category = Category.create(category_params(params))

  category.to_json
end

# update a category. again, why?
put("/categories/:id") do
  category = Category.find_by(id: params[:id])
  category.update(category_params(params))

  category.to_json
end

# delete a category. again, is this path even necessary?
delete("/categories/:id") do
  category = Category.find(params[:id])
  category.destroy
  
  category.to_json
end

# get all contacts, and return as json string
get("/contacts") do
  Contact.all.to_json
end

# get an individual contact by its spk id
get("/contacts/:id") do
  Contact.find(params[:id]).to_json
end

# add a new contact and return as json string
post("/contacts") do
  contact = Contact.create(contact_params(params))
  contact.to_json
end

# update existing contact information
put("/contacts/:id") do
  contact = Contact.find(params[:id])
  contact.update(contact_params(params))

  contact.to_json
end

# delete contact
delete("/contacts/:id") do
  contact = Contact.find(params[:id])
  contact.destroy

  contact.to_json
end

def category_params(params)
  params.slice(*Category.column_names)
end

def contact_params(params)
  params.slice(*Contact.column_names)
end
