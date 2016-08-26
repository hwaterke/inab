module INAB
  module Entities
    class CategoryGroupRepresenter < Grape::Roar::Decorator
      include ::Roar::JSON
      property :id
      property :name
    end

    class CategoryGroups < Grape::API
      crud(CategoryGroup, CategoryGroupRepresenter) do
        requires :name, type: String, desc: "The name of the CategoryGroup"
      end
    end
  end
end
