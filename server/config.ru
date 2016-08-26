require 'bundler'
Bundler.require
DB = Sequel.sqlite

# TODO Remove. For development only.
DB.loggers << Logger.new(STDOUT)

require 'roar/json'
require_relative 'models/account'
require_relative 'models/category_group'
require_relative 'models/category'
require_relative 'models/budget_item'
require_relative 'models/transaction'
require_relative 'models/subtransaction'

require_relative 'api/helpers/crud_helpers'
require_relative 'api/helpers/crud_extension'

require_relative 'api/entities/accounts'
require_relative 'api/entities/category_groups'
require_relative 'api/entities/categories'
require_relative 'api/entities/budget_items'
require_relative 'api/entities/transactions'
require_relative 'api/entities/subtransactions'

require_relative 'api/api'

require_relative 'sinatra'

# TODO Remove. For development only.
require_relative 'development'

run Rack::Cascade.new [INAB::API, INABApp]
