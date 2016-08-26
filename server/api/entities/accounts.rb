module INAB
  module Entities
    class AccountRepresenter < Grape::Roar::Decorator
      include ::Roar::JSON
      property :id
      property :name
    end

    class Accounts < Grape::API
      crud(Account, AccountRepresenter) do
        requires :name, type: String, desc: "The name of the Account"
      end
    end
  end
end
