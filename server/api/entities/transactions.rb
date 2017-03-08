module INAB
  module Entities
    class EmbeddedTagRepresenter < Grape::Roar::Decorator
      include ::Roar::JSON
      property :name
    end

    class EmbeddedSubtransactionRepresenter < Grape::Roar::Decorator
      include ::Roar::JSON
      property :uuid
      property :description
      property :amount
      property :category_uuid
    end

    class TransactionRepresenter < Grape::Roar::Decorator
      include ::Roar::JSON
      property :uuid
      property :date
      property :time
      property :payee
      property :description
      property :amount
      property :category_uuid
      property :account_uuid
      property :transfer_account_uuid
      property :type
      property :cleared_at
      collection :subtransactions, extend: EmbeddedSubtransactionRepresenter
      collection :tags, extend: EmbeddedTagRepresenter
    end

    class Transactions < Grape::API
      before { authenticate! }

      helpers CrudHelpersBuilder.create_for_user Transaction

      helpers do
        params :instance_params do
          requires :date, type: Date, desc: 'The date at which the Transaction took place'
          optional :payee, type: String, desc: 'The payee of the Transaction'
          optional :description, type: String, desc: 'The description of the Transaction'
          optional :amount, type: Integer, desc: 'The amount of the Transaction in cents'
          optional :category_uuid, type: String, desc: 'The uuid of the Category'
          requires :account_uuid, type: String, desc: 'The uuid of the Account'
          optional :transfer_account_uuid, type: String, desc: 'The uuid of the Account to which the transfer occured'
          requires :type, type: Symbol, subtransaction_split: true, desc: 'The type of Transaction'
          optional :cleared_at, type: Date, desc: 'The date at which the Transaction was cleared'
          optional :subtransactions, type: Array do
            optional :description, type: String, desc: 'The description of the Subtransaction'
            requires :amount, type: Integer, desc: 'The amount of the Subtransaction in cents'
            requires :category_uuid, type: String, desc: 'The uuid of the Category'
          end
          optional :tags, type: Array do
            requires :name, type: String, desc: 'The name of the tag'
          end
        end
      end

      helpers do
        def create_instance(declared_params)
          creation_keys = declared_params.merge(user_uuid: connected_user.uuid)
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

            find_instance tr.uuid
          end
        end

        def update_instance(declared_params, entry)
          update_keys = declared_params.dup
          subtransactions_provided = update_keys.delete(:subtransactions)
          tags_provided = update_keys.delete(:tags)

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

          find_instance entry.uuid
        end
      end

      crud_routes Transaction.name, TransactionRepresenter
    end
  end
end
