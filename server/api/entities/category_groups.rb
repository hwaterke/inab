module INAB
  module Entities
    class CategoryGroupRepresenter < Grape::Roar::Decorator
      include ::Roar::JSON
      property :id
      property :name
      property :priority
    end

    class CategoryGroups < Grape::API
      crud(CategoryGroup, CategoryGroupRepresenter) do
        requires :name, type: String, desc: "The name of the CategoryGroup"
        optional :priority, type: Integer, desc: "The ordering priority of the CategoryGroup"
      end
    end
  end
end
