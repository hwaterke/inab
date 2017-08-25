DB.create_table? :subtransactions do
  uuid :uuid, primary_key: true

  String :description
  # Amount in cents
  Integer :amount, null: false, default: 0
  foreign_key :category_uuid, :categories, type: 'uuid'
  foreign_key :transaction_uuid, :transactions, on_delete: :cascade, type: 'uuid'
  DateTime :created_at, null: false
  DateTime :updated_at, null: false
end

class Subtransaction < Sequel::Model
  many_to_one :category, key: :category_uuid
  many_to_one :transaction, key: :transaction_uuid
end
