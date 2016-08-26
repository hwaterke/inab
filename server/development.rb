puts "Development configuration"

a = Account.create(name: 'Checking')
Account.create(name: 'Saving')

cg = CategoryGroup.create(name: 'Monthly Bills')
Category.create(name: 'Rent', category_group: cg)
phone = Category.create(name: 'Phone', category_group: cg)
Category.create(name: 'Internet', category_group: cg)
Category.create(name: 'Electricity', category_group: cg)
Category.create(name: 'Water', category_group: cg)

cg = CategoryGroup.create(name: 'Sporadic Bills')
Category.create(name: 'Haircut', category_group: cg)


# Regular transaction
Transaction.create(
  date: Time.now,
  payee: 'Proximus',
  description: 'Proximus invoice',
  amount: 1500,
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
