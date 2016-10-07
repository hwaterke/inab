# This file is used by Rack-based servers to start the application.
require_relative 'config/application'
run Rack::Cascade.new [INAB::API, INABApp]
