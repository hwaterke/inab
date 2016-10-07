# Creates some dummy data for use in development.
puts "Development configuration"

a = Account.create(name: 'Checking')
as = Account.create(name: 'Saving')

cg = CategoryGroup.create(name: 'Monthly Bills')
Category.create(name: 'Rent', category_group: cg)
phone = Category.create(name: 'Phone', category_group: cg)
internet = Category.create(name: 'Internet', category_group: cg)
Category.create(name: 'Electricity', category_group: cg)
Category.create(name: 'Water', category_group: cg)

cg = CategoryGroup.create(name: 'Sporadic Bills')
Category.create(name: 'Haircut', category_group: cg)


# Regular transaction
Transaction.create(
  date: Time.now,
  payee: 'Proximus',
  description: 'Phone invoice',
  amount: -1500,
  category: phone,
  account: a,
  type: :regular
)

# Inflow transaction
Transaction.create(
  date: Time.now,
  payee: 'Work',
  description: 'Paycheck',
  amount: 50000,
  account: a,
  type: :to_be_budgeted
)

# Transfer transaction
Transaction.create(
  date: Time.now,
  description: 'Saving',
  amount: -700,
  account: a,
  transfer_account: as,
  type: :regular
)

# Split transaction
split_transaction = Transaction.create(
  date: Time.now,
  description: 'A split transaction',
  amount: -1300,
  account: a,
  type: :split
)

Subtransaction.create(
  description: 'Part 1 of split',
  amount: -500,
  category: phone,
  transaction: split_transaction
)

Subtransaction.create(
  description: 'Part 2 of split',
  amount: -800,
  category: internet,
  transaction: split_transaction
)
