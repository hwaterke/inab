def migrate_0_to_1(db_new, db_old)
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
    db_new[table_name].delete
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
    rows = db_old[table_name].all
    rows.delete_if {|row| row[:amount].zero? } if table_name == :budget_items
    db_new[table_name].multi_insert rows
  end

  puts " > payees".blue

  now = Time.now.strftime '%FT%T%:z'
  db_old[:transactions].all do |transaction|
    # Check if it already exist
    unless transaction[:payee].nil? || db_new[:payees].where({name: transaction[:payee], user_uuid: transaction[:user_uuid]}).first
      db_new[:payees].insert({
        uuid: SecureRandom.uuid,
        name: transaction[:payee],
        user_uuid: transaction[:user_uuid],
        created_at: now,
        updated_at: now
      })
    end
  end

  puts " > transactions".blue
  db_old[:transactions].all do |transaction|
    # Add payee_uuid field
    unless transaction[:payee].nil?
      transaction[:payee_uuid] = db_new[:payees].where({name: transaction[:payee], user_uuid: transaction[:user_uuid]}).first[:uuid]
    end

    # Remove payee field
    transaction.delete_if {|key| key == :payee }

    db_new[:transactions].insert(transaction)
  end

  [
    :transaction_tags,
    :subtransactions
  ].each do |table_name|
    puts " > #{table_name}".blue
    rows = db_old[table_name].all
    db_new[table_name].multi_insert rows
  end
end
