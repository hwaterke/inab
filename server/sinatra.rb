class INABApp < Sinatra::Base
  set :public_folder, ENV['INAB_STATIC']
  get '/*' do
    send_file File.expand_path('index.html', settings.public_folder)
  end
end
