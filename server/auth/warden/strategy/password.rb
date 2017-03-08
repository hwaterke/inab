Warden::Strategies.add(:password) do
  MAX_ATTEMPTS = 3
  WAITING_TIME = 300

  def valid?
    params['email'] && params['password']
  end

  def authenticate!
    user = User.first(:email => params['email'])
    if user.nil?
      fail!('The email or password you entered is incorrect.') # Email in this case.
    elsif user.password_failure_number >= MAX_ATTEMPTS and user.password_failure_time and (Time.now - user.password_failure_time < WAITING_TIME)
      fail!("Too many password failures, please wait #{WAITING_TIME / 60}min.")
    elsif user.authenticate(params['password'])
      message = user.password_failure_number > 0 ? "There were #{user.password_failure_number} password failure since your last login." : "Login success"
      user.last_login = DateTime.now
      user.password_failure_number = 0
      user.save
      success!(user, message)
    else
      user.password_failure_number += 1
      user.password_failure_time = DateTime.now
      user.save
      fail!("The email or password you entered is incorrect.") # Password in this case.
    end
  end
end
