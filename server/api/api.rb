module INAB
  class API < Grape::API
    prefix :api
    format :json
    formatter :json, Grape::Formatter::Roar

    helpers CrudHelpers

    mount ::INAB::Entities::Accounts
    mount ::INAB::Entities::CategoryGroups
    mount ::INAB::Entities::Categories
    mount ::INAB::Entities::BudgetItems
    mount ::INAB::Entities::Transactions
    mount ::INAB::Entities::Subtransactions
  end
end
