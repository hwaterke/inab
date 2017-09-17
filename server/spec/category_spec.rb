require_relative 'inab_spec_helper'

describe INAB::Entities::Categories do
  include INAB::Test::Helpers

  no_crud_without_token('categories')

  context 'when logged in' do
    before do
      post_json '/api/login', {email: 'harold', password: '123'}
      @token = last_response.headers['Authorization']
      @category_group_uuid = CategoryGroup.first.uuid
    end

    context 'POST /api/categories' do
      it 'should create a category without goal' do
        entity = {
          name: 'MyName',
          category_group_uuid: @category_group_uuid,
          priority: 0
        }

        header 'Authorization', @token
        post_json '/api/categories', entity
        expect(last_response.status).to eq(201)
        body = symbolize_keys(JSON.parse(last_response.body))
        expect(body).to include(entity)
        expect(body[:goal_type]).to be nil
      end

      it 'should create a category with a target balance goal' do
        entity = {
          name: 'CategoryWithTargetBalance',
          category_group_uuid: @category_group_uuid,
          priority: 0,
          goal_type: 'tb',
          goal_creation_month: '2017-06-01',
          target_balance: 500
        }

        header 'Authorization', @token
        post_json '/api/categories', entity
        expect(last_response.status).to eq(201)
        expect(symbolize_keys(JSON.parse(last_response.body))).to include(entity)
      end

      it 'should create a category with a target balance by date goal' do
        entity = {
          name: 'CategoryWithTargetBalanceByDate',
          category_group_uuid: @category_group_uuid,
          priority: 0,
          goal_type: 'tbd',
          goal_creation_month: '2017-06-01',
          target_balance_month: '2018-06-01',
          target_balance: 500
        }

        header 'Authorization', @token
        post_json '/api/categories', entity
        # expect(last_response.status).to eq(201)
        expect(symbolize_keys(JSON.parse(last_response.body))).to include(entity)
      end

      it 'should create a category with a monthly funding goal' do
        entity = {
          name: 'CategoryWithMonthlyFunding',
          category_group_uuid: @category_group_uuid,
          priority: 0,
          goal_type: 'mf',
          goal_creation_month: '2017-06-01',
          monthly_funding: 500
        }

        header 'Authorization', @token
        post_json '/api/categories', entity
        # expect(last_response.status).to eq(201)
        expect(symbolize_keys(JSON.parse(last_response.body))).to include(entity)
      end
    end
  end
end
