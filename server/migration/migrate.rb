require 'sqlite3'
require 'sequel'
require 'colorize'
require 'securerandom'
require 'logger'
require 'pp'

# ======================================================================
# Helpers

def checkmark
  puts " \u2713".green
end

def schema_version(database)
  return database[:system_settings].where(key: 'schema_version').get(:value) if database.table_exists?(:system_settings)
  '0'
end

require_relative 'migrate0to1'
require_relative 'migrate1to2'

# ======================================================================

puts "INAB - Migration tool starting up".blue

if ARGV.size < 2
  puts "Usage migrate old_database.db new_database.db".red
  exit(-1)
end

database_old_file = File.expand_path ARGV[0]
database_new_file = File.expand_path ARGV[1]

unless File.exist? database_old_file
  puts "Oops, looks like you fucked up ¯\\_(ツ)_/¯".red
  raise "Cannot find file #{database_old_file}"
end

unless File.exist? database_new_file
  puts "Oops, looks like you fucked up ¯\\_(ツ)_/¯".red
  raise "Cannot find file #{database_new_file}"
end

puts "Opening databases".yellow
DB_OLD = Sequel.sqlite(database_old_file)
# DB_OLD.loggers << Logger.new($stdout)
DB_NEW = Sequel.sqlite(database_new_file)
# DB_NEW.loggers << Logger.new($stdout)

puts "Checking schema version".yellow
schema_old = schema_version(DB_OLD)
puts "Schema version, old database: #{schema_old}"
schame_new = schema_version(DB_NEW)
puts "Schema version, mew database: #{schema_new}"

if schema_old == '0' && schame_new == '1'
  migrate_0_to_1 DB_NEW, DB_OLD
elsif schema_old == '1' && schame_new == '2'
  migrate_1_to_2 DB_NEW, DB_OLD
else
  puts "Oops, looks like you fucked up ¯\\_(ツ)_/¯".red
  raise "Cannot migrate schema version #{schema_old} to version #{schame_new}"
end

puts "Great success 🍺".green
