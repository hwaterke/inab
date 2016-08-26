module INAB
  module Entities
    class SubtransactionRepresenter < Grape::Roar::Decorator
      include ::Roar::JSON
      property :id
      property :description
      property :amount
      property :category_id
      property :transaction_id
    end

    class Subtransactions < Grape::API
      crud(Subtransaction, SubtransactionRepresenter) do
        requires :description, type: String, desc: "The description of the Subtransaction"
        requires :amount, type: Integer, desc: "The amount of the Subtransaction in cents"
        requires :category_id, type: Integer, desc: "The id of the Category"
        requires :transaction_id, type: Integer, desc: "The id of the parent Transaction"
      end
    end
  end
end
