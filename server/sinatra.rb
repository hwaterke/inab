require 'sinatra'

class INABApp < Sinatra::Base
  set :public_folder, '../client/public'
  get '/' do
    send_file File.expand_path('index.html', settings.public_folder)
  end
end
