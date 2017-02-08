require_relative 'boot'

ENV['RACK_ENV'] ||= 'test'

Bundler.require :default, ENV['RACK_ENV']

# Force flushing STDOUT to make sure we see logs in due time.
$stdout.sync = true if ENV['RACK_ENV'] == 'development'

DB = (ENV['RACK_ENV'] == 'production') ? Sequel.sqlite('/db/budget.db') : Sequel.sqlite
DB.loggers << Logger.new(STDOUT) if ENV['RACK_ENV'] == 'development'

require 'roar/json'

# Load all models
require_relative File.join('..', 'models', 'account')
require_relative File.join('..', 'models', 'category_group')
require_relative File.join('..', 'models', 'category')
require_relative File.join('..', 'models', 'budget_item')
require_relative File.join('..', 'models', 'transaction_tags')
require_relative File.join('..', 'models', 'transaction')
require_relative File.join('..', 'models', 'subtransaction')

require_relative '../api/helpers/crud_helpers'
require_relative '../api/helpers/crud_extension'

# Load all API validators
Dir['api/validators/*.rb'].each do |f|
  require_relative File.join('..', f)
end

# Load all entities API
Dir['api/entities/*.rb'].each do |f|
  require_relative File.join('..', f)
end

require_relative '../api/api'

require_relative '../sinatra' if ENV['INAB_STATIC']
require_relative 'development' if ENV['RACK_ENV'] == 'development'
