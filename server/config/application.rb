require_relative 'boot'

ENV['RACK_ENV'] ||= 'test'

Bundler.require :default, ENV['RACK_ENV']

# Force flushing STDOUT to make sure we see logs in due time.
$stdout.sync = true if ENV['RACK_ENV'] == 'development'

DB = (ENV['RACK_ENV'] == 'production') ? Sequel.sqlite('/db/budget.db') : Sequel.sqlite
Sequel::Model.plugin :uuid
Sequel::Model.plugin :timestamps, update_on_create: true
DB.loggers << Logger.new(STDOUT) if ENV['RACK_ENV'] == 'development'

require 'roar/json'

# Load settings model
require_relative File.join('..', 'models', 'system_setting')

# Set schema version if not done
SCHEMA_VERSION = 2

schema_version = SystemSetting.with_pk 'schema_version'
if schema_version
  unless schema_version.value == SCHEMA_VERSION.to_s
    raise "Your database is using an old schema (v#{schema_version.value}) instead of #{SCHEMA_VERSION}. Please update"
  end
else
  SystemSetting.create(key: 'schema_version', value: SCHEMA_VERSION.to_s) unless schema_version
end

# Load all models
require_relative File.join('..', 'auth', 'models', 'users')
require_relative File.join('..', 'models', 'account')
require_relative File.join('..', 'models', 'category_group')
require_relative File.join('..', 'models', 'category')
require_relative File.join('..', 'models', 'budget_item')
require_relative File.join('..', 'models', 'payee')
require_relative File.join('..', 'models', 'location')
require_relative File.join('..', 'models', 'transaction_tags')
require_relative File.join('..', 'models', 'transaction')
require_relative File.join('..', 'models', 'subtransaction')

require_relative '../api/helpers/warden_helpers'

require_relative '../api/helpers/crud_api_extention'
require_relative '../api/helpers/crud_helpers_builder'

# Load all API validators
Dir['api/validators/*.rb'].each do |f|
  require_relative File.join('..', f)
end

# Load all entities API
Dir['api/entities/*.rb'].each do |f|
  require_relative File.join('..', f)
end

require_relative '../auth/warden/strategy/password'
require_relative '../auth/warden/jwt'
require_relative '../auth/api/api'

require_relative '../api/api'

require_relative '../sinatra' if ENV['INAB_STATIC']
require_relative 'development' if ENV['RACK_ENV'] == 'development'
