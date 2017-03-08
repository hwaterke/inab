require_relative 'inab_spec_helper'

describe Auth::API do
  include INAB::Test::Helpers

  context 'GET /api/login' do
    it 'is not allowed' do
      get '/api/login'
      expect(last_response.status).to eq(405)
      expect(JSON.parse(last_response.body)).to eq({
        'error' => '405 Not Allowed'
      })
    end
  end

  context 'POST /api/login' do
    it 'fails without credentials' do
      post '/api/login'
      expect(last_response.status).to eq(401)
      expect(JSON.parse(last_response.body)).to eq({
        'error' => 'Not authorized'
      })
    end
  end

  context 'POST /api/login' do
    it 'fails without wrong email and wrong password' do
      post_json '/api/login', {email: 'foo', password: 'bar'}
      expect(last_response.status).to eq(401)
      expect(JSON.parse(last_response.body)).to eq({
        'error' => 'Not authorized',
        'message' => 'The email or password you entered is incorrect.'
      })
    end
  end

  context 'POST /api/login' do
    it 'fails without correct email and wrong password' do
      post_json '/api/login', {email: 'harold', password: 'bar'}
      expect(last_response.status).to eq(401)
      expect(JSON.parse(last_response.body)).to eq({
        'error' => 'Not authorized',
        'message' => 'The email or password you entered is incorrect.'
      })
    end
  end

  context 'POST /api/login' do
    it 'succeeds with correct credentials' do
      post_json '/api/login', {email: 'harold', password: '123'}
      expect(last_response.status).to eq(201)
      expect(last_response.headers).to include 'Authorization'
      expect(last_response.headers['Authorization']).to start_with 'Bearer '
      expect(JSON.parse(last_response.body)).to eq({
        'email' => 'harold'
      })
    end
  end
end
