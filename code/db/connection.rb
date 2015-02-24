require 'active_record'

ActiveRecord::Base.establish_connection({
  :adapter => "postgresql",
  :database => "contact_list",
  :username => "gretchenziegler"
})

ActiveRecord::Base.logger = Logger.new(STDOUT)
