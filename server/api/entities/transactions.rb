module INAB
  module Entities
    class TransactionRepresenter < Grape::Roar::Decorator
      include ::Roar::JSON
      property :id
      property :date
      property :payee
      property :description
      property :amount
      property :category_id
      property :account_id
      property :transfer_account_id
      property :type
    end

    class Transactions < Grape::API
      crud(Transaction, TransactionRepresenter) do
        requires :date, type: Date, desc: "The date at which the Transaction took place"
        requires :payee, type: String, desc: "The payee of the Transaction"
        optional :description, type: String, desc: "The description of the Transaction"
        requires :amount, type: Integer, desc: "The amount of the Transaction in cents"
        optional :category_id, type: Integer, desc: "The id of the Category"
        requires :account_id, type: Integer, desc: "The id of the Account"
        requires :transfer_account_id, type: Integer, desc: "The id of the Account to which the transfer occured"
        requires :type, type: Symbol, desc: "The type of Transaction"
      end
    end
  end
end
