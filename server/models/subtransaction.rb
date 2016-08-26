DB.create_table? :subtransactions do
  primary_key :id
  String :description
  # Amount in cents
  Integer :amount
  foreign_key :category_id, :categories
  foreign_key :transaction_id, :transactions
  DateTime :created_at, null: false
  DateTime :updated_at, null: false
end

class Subtransaction < Sequel::Model
  many_to_one :category
  many_to_one :transaction

  def before_create
    self.updated_at = Time.now
    self.created_at ||= self.updated_at
    super
  end

  def before_update
    self.updated_at ||= Time.now
    super
  end
end
