DB.create_table? :budget_items do
  primary_key :id
  # Year and Month
  Date :month, null: false
  # Amount in cents
  Integer :amount, null: false
  DateTime :created_at, null: false
  DateTime :updated_at, null: false
  foreign_key :category_id, :categories, null: false
end

class BudgetItem < Sequel::Model
  many_to_one :category

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
