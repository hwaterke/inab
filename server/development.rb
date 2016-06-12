puts "Development configuration"

set :fake_latency, 1
enable :logging, :dump_errors, :raise_errors
Model.new(DB, :accounts).create(name: 'Checking account')

cgm = Model.new(DB, :category_groups)
cm = Model.new(DB, :categories)
cg = cgm.create(name: 'Monthly Bills')
cm.create(name: 'Rent', group_id: cg[:id])
cm.create(name: 'Phone', group_id: cg[:id])
cm.create(name: 'Internet', group_id: cg[:id])
cm.create(name: 'Electricity / Gas', group_id: cg[:id])
cm.create(name: 'Water', group_id: cg[:id])

cg = cgm.create(name: 'Sporadic Bills')
cm.create(name: 'Haircut', group_id: cg[:id])

cg = cgm.create(name: 'Everyday Expenses')
cm.create(name: 'Groceries', group_id: cg[:id])
cm.create(name: 'Work Lunch', group_id: cg[:id])
cm.create(name: 'Medical', group_id: cg[:id])
cm.create(name: 'Transport & Parking', group_id: cg[:id])

cg = cgm.create(name: 'Fun')
cm.create(name: 'Spending Money', group_id: cg[:id])
cm.create(name: 'Restaurants', group_id: cg[:id])
cm.create(name: 'Bars', group_id: cg[:id])
cm.create(name: 'Clothing', group_id: cg[:id])
cm.create(name: 'Gifts', group_id: cg[:id])
cm.create(name: 'Citytrips', group_id: cg[:id])

cg = cgm.create(name: 'Rainy Day Funds')
cm.create(name: 'Pension', group_id: cg[:id])
cm.create(name: 'Birthdays', group_id: cg[:id])
cm.create(name: 'Christmas', group_id: cg[:id])
cm.create(name: 'Car Insurance', group_id: cg[:id])
cm.create(name: 'Emergency Fund', group_id: cg[:id])

cg = cgm.create(name: 'Saving Goals')
cm.create(name: 'Summer Vacation', group_id: cg[:id])
cm.create(name: 'New Phone', group_id: cg[:id])
cm.create(name: 'New Monitor', group_id: cg[:id])
cm.create(name: 'New Laptop', group_id: cg[:id])
cm.create(name: 'House', group_id: cg[:id])
