h = User.create(
  email: 'harold',
  password: '123',
  password_confirmation: '123',
  is_admin: true
)

Account.create(
  user: h,
  name: 'Harold Account 1'
)

hcg1 = CategoryGroup.create(user: h, name: 'Harold CategoryGroup 1')
Category.create(user: h, name: 'Harold Category 1', category_group: hcg1)

d = User.create(
  email: 'dijkstra',
  password: '321',
  password_confirmation: '321'
)

Account.create(user: d, name: 'Account Dijkstra')
