module Auth
  class API < Grape::API

    post :login do
      env['warden'].authenticate! :password
      {email: env['warden'].user.email}
    end

  end
end
