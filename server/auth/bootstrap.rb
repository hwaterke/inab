# Bootstrap by creating a User if none exist.

if User.count == 0
  puts 'No user found.'

  if ENV['EMAIL'] && ENV['PASSWORD']
    puts "Creating user #{ENV['EMAIL']}"
    User.create(
      email: ENV['EMAIL'],
      password: ENV['PASSWORD'],
      password_confirmation: ENV['PASSWORD']
    )
  end
end
