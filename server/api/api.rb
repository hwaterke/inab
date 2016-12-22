module INAB
  class API < Grape::API
    prefix :api
    format :json
    formatter :json, Grape::Formatter::Roar
    rescue_from Sequel::ValidationFailed

    helpers CrudHelpers

    mount ::INAB::Entities::Accounts
    mount ::INAB::Entities::CategoryGroups
    mount ::INAB::Entities::Categories
    mount ::INAB::Entities::BudgetItems
    mount ::INAB::Entities::Transactions
  end
end
