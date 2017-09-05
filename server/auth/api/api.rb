module Auth
  class API < Grape::API

    post :login do
      env['warden'].authenticate! :password
      {email: env['warden'].user.email, is_admin: env['warden'].user.is_admin}
    end

  end
end
