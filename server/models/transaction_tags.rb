DB.create_table? :transaction_tags do
  foreign_key :transaction_id, :transactions, on_delete: :cascade
  String :name, null: false
  DateTime :created_at, null: false
  DateTime :updated_at, null: false
  primary_key [:transaction_id, :name]
end

class TransactionTag < Sequel::Model
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

TransactionTag.unrestrict_primary_key
