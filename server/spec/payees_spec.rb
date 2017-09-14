require_relative 'inab_spec_helper'

describe INAB::Entities::Payees do
  include INAB::Test::Helpers

  context 'without token' do
    context 'GET /api/payees/uuid' do
      it 'requires authentication' do
        get '/api/payees/uuid'
        expect(last_response.status).to eq(401)
      end
    end

    context 'GET /api/payees' do
      it 'requires authentication' do
        get '/api/payees'
        expect(last_response.status).to eq(401)
      end
    end

    context 'POST /api/payees' do
      it 'requires authentication' do
        post_json '/api/payees', {name: 'MyPayee', locations: []}
        expect(last_response.status).to eq(401)
      end
    end

    context 'PATCH /api/payees/uuid' do
      it 'requires authentication' do
        patch_json '/api/payees/uuid', {name: 'MyPayee'}
        expect(last_response.status).to eq(401)
      end
    end

    context 'DELETE /api/payees/uuid' do
      it 'requires authentication' do
        delete '/api/payees/uuid'
        expect(last_response.status).to eq(401)
      end
    end
  end

  context 'when logged in' do
    before do
      post_json '/api/login', {email: 'harold', password: '123'}
      @token = last_response.headers['Authorization']
    end

    context 'POST /api/payees' do
      it 'returns the created payee' do
        header 'Authorization', @token
        post_json '/api/payees', {name: 'MyPayee', locations: []}
        expect(last_response.status).to eq(201)
        expect(JSON.parse(last_response.body)).to include('name' => 'MyPayee', 'locations'=> [])
      end

      it 'should create a payee with locations' do
        header 'Authorization', @token
        data = {
          "name" => 'Manneken Pis',
          "locations" => [
            {
              "latitude" => 50.844992,
              "longitude" => 4.349980
            }
          ]}
        post_json '/api/payees', data
        expect(last_response.status).to eq(201)
        expect(JSON.parse(last_response.body)).to include(data)
      end
    end

    context 'PATCH' do
      it 'updates existing payee' do
        header 'Authorization', @token

        payee_uuid= Payee.last().uuid

        data = {
          "name" => 'Manneken Pis 2',
          "locations" => [
            {
              "latitude" => 50,
              "longitude" => 4
            },
            {
              "latitude" => 50.844992,
              "longitude" => 4.349980
            }
          ]}

        patch_json "/api/payees/#{payee_uuid}", data
        expect(last_response.status).to eq(200)
        expect(JSON.parse(last_response.body)).to include(data)

        get '/api/payees'
        expect(last_response.status).to eq(200)
        expect(JSON.parse(last_response.body).fetch('data').size).to eq(2)
      end
    end

    context 'DELETE' do
      it 'deletes a payee' do
        header 'Authorization', @token

        get '/api/payees'
        expect(last_response.status).to eq(200)
        expect(JSON.parse(last_response.body).fetch('data').size).to eq(2)

        payee_uuid = Payee.first().uuid
        delete "/api/payees/#{payee_uuid}"
        expect(last_response.status).to eq(204)
        expect(last_response.body).to be_empty

        get '/api/payees'
        expect(last_response.status).to eq(200)
        expect(JSON.parse(last_response.body).fetch('data').size).to eq(1)
      end
    end

  end
end
