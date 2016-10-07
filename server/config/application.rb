require_relative 'boot'

ENV['RACK_ENV'] ||= 'test'

Bundler.require :default, ENV['RACK_ENV']

# Force flushing STDOUT to make sure we see logs in due time.
$stdout.sync = true if ENV['RACK_ENV'] == 'development'

DB = Sequel.sqlite
DB.loggers << Logger.new(STDOUT) if ENV['RACK_ENV'] == 'development'

require 'roar/json'

# Load all models
Dir['models/*.rb'].each do |f|
  require_relative File.join('..', f)
end

require_relative '../api/helpers/crud_helpers'
require_relative '../api/helpers/crud_extension'

# Load all entities API
Dir['api/entities/*.rb'].each do |f|
  require_relative File.join('..', f)
end

require_relative '../api/api'

require_relative '../sinatra'

require_relative 'development' if ENV['RACK_ENV'] == 'development'
