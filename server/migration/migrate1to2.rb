def migrate_1_to_2(db_new, db_old)
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
    :payees,
    :locations,
    :accounts,
    :category_groups,
    :categories,
    :budget_items,
    :transactions,
    :transaction_tags,
    :subtransactions
  ].each do |table_name|
    puts " > #{table_name}".blue
    rows = db_old[table_name].all
    rows.delete_if {|row| row[:amount].zero? } if table_name == :budget_items
    db_new[table_name].multi_insert rows
  end
end
