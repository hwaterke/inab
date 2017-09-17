module INAB
  module Entities
    class CategoryRepresenter < Grape::Roar::Decorator
      include ::Roar::JSON
      property :uuid
      property :name
      property :priority
      property :category_group_uuid
      # Goal
      property :goal_type
      property :goal_creation_month
      property :target_balance
      property :target_balance_month
      property :monthly_funding
    end

    class Categories < Grape::API
      before { authenticate! }

      helpers CrudHelpersBuilder.create_for_user Category
      helpers do
        params :instance_params do
          requires :name, type: String, desc: 'The name of the Category'
          optional :priority, type: Integer, desc: 'The ordering priority of the Category'
          requires :category_group_uuid, type: String, desc: 'The id of the CategoryGroup'
          # Goal
          optional :goal_type, type: Symbol, desc: 'The type of goal'
          optional :goal_creation_month, type: Date, desc: 'The date at which the goal was created'
          optional :target_balance, type: Integer, desc: 'The target balance in cents'
          optional :target_balance_month, type: Date, desc: 'The date at which the Transaction took place'
          optional :monthly_funding, type: Integer, desc: 'The target amount per month'
        end
      end

      crud_routes Category.name, CategoryRepresenter
    end
  end
end
