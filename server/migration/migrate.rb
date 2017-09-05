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

# ======================================================================

puts "INAB - Migration tool starting up".blue

if ARGV.size < 2
  puts "Usage migrate2V1 old_database.db new_database.db".red
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
unless schema_version(DB_OLD) == '0'
  puts "Oops, looks like you fucked up ¯\\_(ツ)_/¯".red
  raise "Expected schema version of #{database_old_file} to be 0"
end

unless schema_version(DB_NEW) == '1'
  puts "Oops, looks like you fucked up ¯\\_(ツ)_/¯".red
  raise "Expected schema version of #{database_new_file_file} to be 1"
end

# Empty new database before migrating
puts "Emptying new database".yellow

[
  :budget_items,
  :transaction_tags,
  :subtransactions,
  :transactions,
  :accounts,
  :categories,
  :category_groups,
  :locations,
  :payees,
  :users
].each do |table_name|
  puts " > Emptying #{table_name}".blue
  DB_NEW[table_name].delete
end

puts "Starting migration".yellow

[
  :users,
  :accounts,
  :category_groups,
  :categories,
  :budget_items
].each do |table_name|
  puts " > #{table_name}".blue
  rows = DB_OLD[table_name].all
  rows.delete_if {|row| row[:amount].zero? } if table_name == :budget_items
  DB_NEW[table_name].multi_insert rows
end

puts " > payees".blue

now = Time.now.strftime '%FT%T%:z'
DB_OLD[:transactions].all do |transaction|
  # Check if it already exist
  unless transaction[:payee].nil? || DB_NEW[:payees].where({name: transaction[:payee], user_uuid: transaction[:user_uuid]}).first
    DB_NEW[:payees].insert({
      uuid: SecureRandom.uuid,
      name: transaction[:payee],
      user_uuid: transaction[:user_uuid],
      created_at: now,
      updated_at: now
    })
  end
end

puts " > transactions".blue
DB_OLD[:transactions].all do |transaction|
  # Add payee_uuid field
  unless transaction[:payee].nil?
    transaction[:payee_uuid] = DB_NEW[:payees].where({name: transaction[:payee], user_uuid: transaction[:user_uuid]}).first[:uuid]
  end

  # Remove payee field
  transaction.delete_if {|key| key == :payee }

  DB_NEW[:transactions].insert(transaction)
end

[
  :transaction_tags,
  :subtransactions
].each do |table_name|
  puts " > #{table_name}".blue
  rows = DB_OLD[table_name].all
  DB_NEW[table_name].multi_insert rows
end

puts "Great success 🍺".green
