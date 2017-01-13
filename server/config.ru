# This file is used by Rack-based servers to start the application.
require_relative 'config/application'

if ENV['RACK_ENV'] == 'production' and not ENV['INAB_STATIC']
  run INAB::API
else
  run Rack::Cascade.new [INAB::API, INABApp]
end
