require_relative 'inab_spec_helper'

describe Auth::API do
  include INAB::Test::Helpers

  context 'GET /api/register' do
    it 'is not allowed' do
      get '/api/register'
      expect(last_response.status).to eq(405)
      expect(JSON.parse(last_response.body)).to eq({
        'error' => '405 Not Allowed'
      })
    end
  end

  context 'POST /api/register' do
    it 'fails without credentials' do
      post '/api/register'
      expect(last_response.status).to eq(400)
      expect(JSON.parse(last_response.body)).to eq({
        'error' => 'email is missing, password is missing'
      })
    end

    it 'fails without email' do
      post '/api/register', {password: '123'}
      expect(last_response.status).to eq(400)
      expect(JSON.parse(last_response.body)).to eq({
        'error' => 'email is missing'
      })
    end

    it 'fails without password' do
      post '/api/register', {email: '123'}
      expect(last_response.status).to eq(400)
      expect(JSON.parse(last_response.body)).to eq({
        'error' => 'password is missing'
      })
    end

    it 'fails when registrations are closed' do
      post_json '/api/register', {email: 'foo', password: 'bar'}
      expect(last_response.status).to eq(403)
      expect(JSON.parse(last_response.body)).to eq({
        'error' => 'Forbidden',
        'message' => 'Registrations are closed for now.'
      })
    end

    it 'suceeds when registrations are open' do
      registration = SystemSetting.with_pk 'registration'
      SystemSetting.create(key: 'registration', value: '1') unless registration

      post_json '/api/register', {email: 'new-user@example.com', password: 'abcd'}
      expect(last_response.status).to eq(201)
      expect(last_response.headers).to include 'Authorization'
      expect(last_response.headers['Authorization']).to start_with 'Bearer '
      expect(JSON.parse(last_response.body)).to eq({
        'email' => 'new-user@example.com',
        'is_admin' => false
      })
    end

  end

end
