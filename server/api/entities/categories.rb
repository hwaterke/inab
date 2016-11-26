module INAB
  module Entities
    class CategoryRepresenter < Grape::Roar::Decorator
      include ::Roar::JSON
      property :id
      property :name
      property :priority
      property :category_group_id
    end

    class Categories < Grape::API
      crud(Category, CategoryRepresenter) do
        requires :name, type: String, desc: "The name of the Category"
        optional :priority, type: Integer, desc: "The ordering priority of the Category"
        requires :category_group_id, type: Integer, desc: "The id of the CategoryGroup"
      end
    end
  end
end
