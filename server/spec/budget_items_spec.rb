require_relative 'inab_spec_helper'

describe INAB::Entities::BudgetItems do
  include INAB::Test::Helpers

  context 'when logged in' do
    before do
      post_json '/api/login', {email: 'harold', password: '123'}
      @token = last_response.headers['Authorization']
    end

    context 'GET /api/budget_items' do
      it 'returns all budget items' do
        header 'Authorization', @token
        get '/api/budget_items'
        expect(last_response.status).to eq(200)
        expect(JSON.parse(last_response.body)).to eq({'data' => []})
      end
    end

    context 'POST /api/budget_items' do
      it 'returns the created budget item' do
        header 'Authorization', @token

        category_uuid = Category.first(name: 'Harold Category 1').uuid

        post_json '/api/budget_items', {
          month: '2017-01-01',
          amount: 500,
          category_uuid: category_uuid
        }
        expect(last_response.status).to eq(201)
        expect(JSON.parse(last_response.body)).to include(
          'uuid' => "2017-01-01-#{category_uuid}",
          'amount' => 500,
          'category_uuid' => category_uuid,
          'month' => '2017-01-01'
        )
      end

      it 'updates existing budget item' do
        header 'Authorization', @token

        category_uuid = Category.first(name: 'Harold Category 1').uuid

        patch_json "/api/budget_items/2017-01-01-#{category_uuid}", {
          month: '2017-01-01',
          amount: 800,
          category_uuid: category_uuid
        }
        expect(last_response.status).to eq(200)
        expect(JSON.parse(last_response.body)).to include(
          'uuid' => "2017-01-01-#{category_uuid}",
          'amount' => 800,
          'category_uuid' => category_uuid,
          'month' => '2017-01-01'
        )

        get '/api/budget_items'
        expect(last_response.status).to eq(200)
        expect(JSON.parse(last_response.body).fetch('data').size).to eq(1)
      end
    end

    context 'GET /api/budget_items/uuid' do
      it 'returns all budget items' do
        header 'Authorization', @token

        category_uuid = Category.first(name: 'Harold Category 1').uuid

        get "/api/budget_items/2017-01-01-#{category_uuid}"
        expect(last_response.status).to eq(200)
        expect(JSON.parse(last_response.body)).to eq(
          'uuid' => "2017-01-01-#{category_uuid}",
          'month' => '2017-01-01',
          'amount' => 800,
          'category_uuid' => category_uuid
        )
      end
    end
  end
end
