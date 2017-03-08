module INAB
  module Entities
    class BudgetItemRepresenter < Grape::Roar::Decorator
      include ::Roar::JSON
      property :uuid
      property :month
      property :amount
      property :category_uuid
    end

    class BudgetItems < Grape::API
      before { authenticate! }

      helpers CrudHelpersBuilder.create_for_user BudgetItem

      helpers do
        params :instance_params do
          requires :month, type: Date, desc: 'The month of the BudgetItem'
          requires :amount, type: Integer, desc: 'The amount of the BudgetItem in cents'
          requires :category_uuid, type: String, desc: 'The uuid of the Category'
        end
      end

      helpers do
        def split_date_category(query_parameter_id)
          data = query_parameter_id.split('-')
          return Date.new(data[0].to_i, data[1].to_i), data[3..-1].join('-')
        end

        def find_instance(query_parameter_id)
          month, category_uuid = split_date_category(query_parameter_id)
          instance = type.first(month: month, category_uuid: category_uuid, user_uuid: connected_user.uuid)
          error! :not_found, 404 unless instance
          instance
        end
      end

      crud_routes BudgetItem.name, BudgetItemRepresenter
    end
  end
end
