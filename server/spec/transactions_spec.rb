require_relative 'inab_spec_helper'

describe INAB::Entities::Transactions do
  include INAB::Test::Helpers

  no_crud_without_token('transactions')

  context 'when logged in' do
    before do
      post_json '/api/login', {email: 'harold', password: '123'}
      @token = last_response.headers['Authorization']
    end

    context 'GET /api/transactions' do
      it 'returns all transactions' do
        header 'Authorization', @token
        get '/api/transactions'
        expect(last_response.status).to eq(200)
        expect(JSON.parse(last_response.body)).to eq({'data' => []})
      end
    end

    context 'POST /api/transactions' do
      it 'create a simple transaction' do
        header 'Authorization', @token

        account_uuid = Account.first(name: 'Harold Account 1').uuid

        post_json '/api/transactions', {
          date: '2017-01-01',
          amount: 100,
          account_uuid: account_uuid,
          type: 'regular',
          tags: [],
          subtransactions: []
        }
        expect(last_response.status).to eq(201)
        expect(JSON.parse(last_response.body)).to include(
          'account_uuid' => account_uuid,
          'amount' => 100,
          'date' => '2017-01-01',
          'subtransactions' => [],
          'tags' => [],
          'type' => 'regular'
        )
      end

      it 'create a tagged transaction' do
        header 'Authorization', @token

        account_uuid = Account.first(name: 'Harold Account 1').uuid

        post_json '/api/transactions', {
          date: '2017-01-01',
          amount: 200,
          account_uuid: account_uuid,
          tags: [
            {name: 'Tag 1'},
            {name: 'Tag 2'}
          ],
          type: 'regular',
          subtransactions: []
        }
        expect(last_response.status).to eq(201)
        expect(JSON.parse(last_response.body)).to include(
          'account_uuid' => account_uuid,
          'amount' => 200,
          'date' => '2017-01-01',
          'subtransactions' => [],
          'tags' => [{'name' => 'Tag 1'}, {'name' => 'Tag 2'}],
          'type' => 'regular'
        )
      end

    end
  end
end
