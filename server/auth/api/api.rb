module Auth
  class API < Grape::API

    post :login do
      env['warden'].authenticate! :password
      {email: env['warden'].user.email, is_admin: env['warden'].user.is_admin}
    end

    params do
      requires :email, type: String
      requires :password, type: String
    end
    post :register do
      # Are registration open?
      first_user = (User.count == 0)
      registration_setting = SystemSetting.with_pk 'registration'
      registration_open = (first_user || registration_setting && registration_setting[:value] == '1')

      if registration_open
        User.create(
          email: params['email'],
          password: params['password'],
          password_confirmation: params['password'],
          is_admin: first_user
        )

        env['warden'].authenticate! :password
        {email: env['warden'].user.email, is_admin: env['warden'].user.is_admin}
      else
        error!({error: 'Forbidden', message: 'Registrations are closed for now.'}, 403)
      end
    end

  end
end
