module INAB
  module Entities
    class CategoryRepresenter < Grape::Roar::Decorator
      include ::Roar::JSON
      property :uuid
      property :name
      property :priority
      property :category_group_uuid
    end

    class Categories < Grape::API
      before { authenticate! }

      helpers CrudHelpersBuilder.create_for_user Category
      helpers do
        params :instance_params do
          requires :name, type: String, desc: 'The name of the Category'
          optional :priority, type: Integer, desc: 'The ordering priority of the Category'
          requires :category_group_uuid, type: String, desc: 'The id of the CategoryGroup'
        end
      end

      crud_routes Category.name, CategoryRepresenter
    end
  end
end
