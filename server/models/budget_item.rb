DB.create_table? :budget_items do
  foreign_key :user_uuid, :users, null: false, type: 'uuid'
  foreign_key :category_uuid, :categories, null: false, type: 'uuid'
  # Year and Month
  Date :month, null: false
  # Amount in cents
  Integer :amount, null: false
  DateTime :created_at, null: false
  DateTime :updated_at, null: false
  primary_key [:month, :category_uuid]
end

class BudgetItem < Sequel::Model
  many_to_one :user, key: :user_uuid
  many_to_one :category, key: :category_uuid

  def uuid
    "#{month}-#{category_uuid}"
  end

  def validate
    super
    errors.add(:month, 'must be first day of the month') unless month.day == 1
  end

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

BudgetItem.unrestrict_primary_key