module INAB
  module Entities
    class BudgetItemRepresenter < Grape::Roar::Decorator
      include ::Roar::JSON
      property :id
      property :month
      property :amount
      property :category_id
    end

    class BudgetItems < Grape::API
      crud(BudgetItem, BudgetItemRepresenter) do
        requires :month, type: Date, desc: "The month of the BudgetItem"
        requires :amount, type: Integer, desc: "The amount of the BudgetItem in cents"
        requires :category_id, type: Integer, desc: "The id of the Category"
      end
    end
  end
end
