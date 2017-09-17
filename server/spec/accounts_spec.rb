require_relative 'inab_spec_helper'

describe INAB::Entities::Accounts do
  include INAB::Test::Helpers

  no_crud_without_token('accounts')

  context 'when logged in' do
    before do
      post_json '/api/login', {email: 'harold', password: '123'}
      @token = last_response.headers['Authorization']
    end

    context 'GET /api/accounts' do
      it 'returns all accounts' do
        header 'Authorization', @token
        get '/api/accounts'
        expect(last_response.status).to eq(200)
        parsed_body = JSON.parse(last_response.body)
        expect(parsed_body).to include('data')
        expect(parsed_body['data'].size).to be(1)
        expect(parsed_body['data'].first).to include('name' => 'Harold Account 1')
      end

      it 'is not possible to get the account of someone else' do
        header 'Authorization', @token
        account_uuid = Account.first(name: 'Account Dijkstra').uuid
        get "/api/accounts/#{account_uuid}"
        expect(last_response.status).to eq(404)
      end
    end

    context 'POST /api/accounts' do
      it 'returns the created account' do
        header 'Authorization', @token
        post_json '/api/accounts', {name: 'MyAccount'}
        expect(last_response.status).to eq(201)
        expect(JSON.parse(last_response.body)).to include('name' => 'MyAccount')
      end
    end

    context 'PATCH /api/accounts' do
      it 'returns the updated account' do
        header 'Authorization', @token

        # Grab existing account
        account_uuid = Account.first(name: 'MyAccount').uuid

        patch_json "/api/accounts/#{account_uuid}", {name: 'MyAccount2'}
        expect(last_response.status).to eq(200)
        expect(JSON.parse(last_response.body)).to include('name' => 'MyAccount2')
      end

      it 'is not possible to change uuid' do
        header 'Authorization', @token

        # Grab existing account
        account_uuid = Account.first(name: 'MyAccount2').uuid

        patch_json "/api/accounts/#{account_uuid}", {uuid: 'other', name: 'MyAccount3'}
        expect(last_response.status).to eq(200)
        expect(JSON.parse(last_response.body)).to eq('uuid' => account_uuid, 'name' => 'MyAccount3')
      end

      it 'is not possible to change owner' do
        header 'Authorization', @token

        # Grab existing account
        account_uuid = Account.first(name: 'MyAccount3').uuid

        patch_json "/api/accounts/#{account_uuid}", {user_uuid: 'other', name: 'MyAccount4'}
        expect(last_response.status).to eq(200)
        expect(JSON.parse(last_response.body)).to eq('uuid' => account_uuid, 'name' => 'MyAccount4')
      end

    end

    context 'DELETE /api/accounts/:uuid' do
      it 'is deletes the account' do
        header 'Authorization', @token

        # Grab existing account
        account_uuid = Account.first(name: 'MyAccount4').uuid

        delete "/api/accounts/#{account_uuid}"
        expect(last_response.status).to eq(204)
        expect(last_response.body).to be_empty
      end
    end
  end
end
