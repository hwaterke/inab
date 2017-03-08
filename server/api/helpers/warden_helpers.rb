module WardenHelpers
  def warden
    env['warden']
  end

  def authenticate!
    warden.authenticate!
  end

  def connected_user
    warden.user
  end
end
