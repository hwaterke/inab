module INAB
  module Entities
    class CategoryGroupRepresenter < Grape::Roar::Decorator
      include ::Roar::JSON
      property :uuid
      property :name
      property :priority
    end

    class CategoryGroups < Grape::API
      before { authenticate! }

      helpers CrudHelpersBuilder.create_for_user CategoryGroup
      helpers do
        params :instance_params do
          requires :name, type: String, desc: 'The name of the CategoryGroup'
          optional :priority, type: Integer, desc: 'The ordering priority of the CategoryGroup'
        end
      end

      crud_routes CategoryGroup.name, CategoryGroupRepresenter
    end
  end
end
