# Creates some dummy data for use in development.
puts 'Development configuration'

user = User.first(email: 'harold@example.com')
unless user
  user = User.create(
    email: 'harold@example.com',
    password: '123',
    password_confirmation: '123'
  )
end

a = Account.create(user: user, name: 'Checking')
as = Account.create(user: user, name: 'Saving')

cg = CategoryGroup.create(user: user, name: 'Monthly Bills')
Category.create(user: user, name: 'Rent', category_group: cg)
phone = Category.create(user: user, name: 'Phone', category_group: cg)
internet = Category.create(user: user, name: 'Internet', category_group: cg)
Category.create(user: user, name: 'Electricity', category_group: cg)
Category.create(user: user, name: 'Water', category_group: cg)

cg = CategoryGroup.create(user: user, name: 'Sporadic Bills')
Category.create(user: user, name: 'Haircut', category_group: cg)

BudgetItem.create(
  user: user,
  amount: 100,
  category: phone,
  month: Time.new(Time.now.year, Time.now.month)
)

proximus = Payee.create(name: 'Proximus', user: user)
work = Payee.create(name: 'Work', user: user)

Location.create(payee: proximus, latitude: 50.860139, longitude: 4.358062)

# Regular transaction
mtr = Transaction.create(
  user: user,
  date: Time.now,
  time: Time.now,
  payee: proximus,
  description: 'Phone invoice',
  amount: -1500,
  category: phone,
  account: a,
  type: :regular
)

mtr.add_tag({:name => 'Tag1'})
mtr.add_tag({:name => 'Tag2'})

# Inflow transaction
Transaction.create(
  user: user,
  date: Time.now,
  payee: work,
  description: 'Paycheck',
  amount: 50000,
  account: a,
  type: :to_be_budgeted
)

# Transfer transaction
Transaction.create(
  user: user,
  date: Time.now,
  description: 'Saving',
  amount: -700,
  account: a,
  transfer_account: as,
  type: :regular
)

# Split transaction
split_transaction = Transaction.create(
  user: user,
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
