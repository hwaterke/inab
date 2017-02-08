module INAB
  module Entities
    class EmbeddedTagRepresenter < Grape::Roar::Decorator
      include ::Roar::JSON
      property :name
    end

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
      property :time
      property :payee
      property :description
      property :amount
      property :category_id
      property :account_id
      property :transfer_account_id
      property :type
      property :cleared_at
      collection :subtransactions, extend: EmbeddedSubtransactionRepresenter
      collection :tags, extend: EmbeddedTagRepresenter
    end

    class Transactions < Grape::API
      helpers do
        params :transaction_params do
          requires :date, type: Date, desc: "The date at which the Transaction took place"
          optional :payee, type: String, desc: "The payee of the Transaction"
          optional :description, type: String, desc: "The description of the Transaction"
          optional :amount, type: Integer, desc: "The amount of the Transaction in cents"
          optional :category_id, type: Integer, desc: "The id of the Category"
          requires :account_id, type: Integer, desc: "The id of the Account"
          optional :transfer_account_id, type: Integer, desc: "The id of the Account to which the transfer occured"
          requires :type, type: Symbol, subtransaction_split: true, desc: "The type of Transaction"
          optional :cleared_at, type: Date, desc: "The date at which the Transaction was cleared"
          optional :subtransactions, type: Array do
            optional :description, type: String, desc: "The description of the Subtransaction"
            requires :amount, type: Integer, desc: "The amount of the Subtransaction in cents"
            optional :category_id, type: Integer, desc: "The id of the Category"
          end
          optional :tags, type: Array do
            optional :name, type: String, desc: "The name of the tag"
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
          tags_provided = creation_keys.delete(:tags)

          Transaction.db.transaction do
            tr = Transaction.create(creation_keys)

            if subtransactions_provided
              subtransactions_provided.each do |subtr|
                tr.add_subtransaction(subtr)
              end
            end

            if tags_provided
              tags_provided.each do |tag|
                tr.add_tag(tag)
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
          tags_provided = update_keys.delete(:tags)

          entry = find_instance(Transaction, params[:id])

          Transaction.db.transaction do
            entry.update(update_keys)

            # Delete existing subtransactions
            entry.subtransactions.each { |st| st.destroy }
            entry.tags.each { |tag| tag.destroy }

            # Create new subtransactions
            if subtransactions_provided
              subtransactions_provided.each do |subtr|
                entry.add_subtransaction(subtr)
              end
            end

            if tags_provided
              tags_provided.each do |tag|
                entry.add_tag(tag)
              end
            end
          end

          present find_instance(Transaction, entry.id), with: TransactionRepresenter
        end
      end
    end
  end
end
