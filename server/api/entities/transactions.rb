module INAB
  module Entities
    class EmbeddedSubtransactionRepresenter < Grape::Roar::Decorator
      include ::Roar::JSON
      property :id
      property :description
      property :amount
      property :category_id
    end

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
      collection :subtransactions, extend: EmbeddedSubtransactionRepresenter
    end

    class Transactions < Grape::API
      helpers do
        params :transaction_params do
          requires :date, type: Date, desc: "The date at which the Transaction took place"
          optional :payee, type: String, desc: "The payee of the Transaction"
          optional :description, type: String, desc: "The description of the Transaction"
          requires :amount, type: Integer, desc: "The amount of the Transaction in cents"
          optional :category_id, type: Integer, desc: "The id of the Category"
          requires :account_id, type: Integer, desc: "The id of the Account"
          optional :transfer_account_id, type: Integer, desc: "The id of the Account to which the transfer occured"
          requires :type, type: Symbol, desc: "The type of Transaction"
          optional :subtransactions, type: Array do
            requires :description, type: String, desc: "The description of the Subtransaction"
            requires :amount, type: Integer, desc: "The amount of the Subtransaction in cents"
            requires :category_id, type: Integer, desc: "The id of the Category"
          end
        end
      end

      resource plural_of(Transaction) do
        get_one(Transaction, TransactionRepresenter)
        get_all(Transaction, TransactionRepresenter)
        # TODO the returned transactions does not contain its subtransactions
        delete_one(Transaction, TransactionRepresenter)

        desc "Creates a new Transaction"
        params do
          use :transaction_params
        end
        post do
          creation_keys = declared(params).dup
          subtransactions_provided = creation_keys.delete(:subtransactions)

          Transaction.db.transaction do
            tr = Transaction.create(creation_keys)

            if subtransactions_provided
              subtransactions_provided.each do |subtr|
                Subtransaction.create(subtr.merge({transaction_id: tr.id}))
              end
            end

            present find_instance(Transaction, tr.id), with: TransactionRepresenter
          end
        end

        desc "Updates an existing Transaction"
        params do
          requires :id, type: String, desc: "The id of the Transaction"
          use :transaction_params
        end
        patch ':id' do
          update_keys = declared(params).dup
          update_keys.delete(:id)
          subtransactions_provided = update_keys.delete(:subtransactions)

          entry = find_instance(Transaction, params[:id])

          Transaction.db.transaction do
            entry.update(update_keys)

            # Delete existing subtransactions
            entry.subtransactions.each { |st| st.destroy }

            # Create new subtransactions
            if subtransactions_provided
              subtransactions_provided.each do |subtr|
                Subtransaction.create(subtr.merge({transaction_id: entry.id}))
              end
            end
          end

          present find_instance(Transaction, entry.id), with: TransactionRepresenter
        end
      end
    end
  end
end
