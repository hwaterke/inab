module INAB
  module Entities
    class AccountRepresenter < Grape::Roar::Decorator
      include ::Roar::JSON
      property :uuid
      property :name
    end

    class Accounts < Grape::API
      before { authenticate! }

      helpers CrudHelpersBuilder.create_for_user Account
      helpers do
        params :instance_params do
          requires :name, type: String, desc: 'The name of the Account'
        end
      end

      crud_routes Account.name, AccountRepresenter
    end
  end
end
