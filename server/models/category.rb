DB.create_table? :categories do
  uuid :uuid, primary_key: true
  foreign_key :user_uuid, :users, null: false, type: 'uuid'
  foreign_key :category_group_uuid, :category_groups, null: false, type: 'uuid'
  String :name, null: false, unique: true
  Integer :priority, null: false, default: 0

  Integer :goal_type

  Date :goal_creation_month
  Integer :target_balance, null: false, default: 0
  Date :target_balance_month
  Integer :monthly_funding, null: false, default: 0

  DateTime :created_at, null: false
  DateTime :updated_at, null: false
end

class Category < Sequel::Model
  many_to_one :user, key: :user_uuid
  many_to_one :category_group, key: :category_group_uuid

  plugin :enum
  enum :goal_type, [:tb, :tbd, :mf]

  plugin :validation_helpers

  def validate
    super
    validates_presence :goal_creation_month if goal_type
    errors.add(:goal_creation_month, 'must be first day of the month') if goal_creation_month && !(goal_creation_month.day == 1)
    validates_operator(:>, 0, :target_balance) if [:tb, :tbd].include? goal_type

    validates_presence :target_balance_month if goal_type == :tbd
    errors.add(:target_balance_month, ' must be blank for goal different than tbd') unless target_balance_month.nil? || goal_type == :tbd

    validates_operator(:>, 0, :monthly_funding) if goal_type == :mf
    errors.add(:monthly_funding, ' must be 0 for goal different than mf') unless monthly_funding.nil? || monthly_funding == 0 || goal_type == :mf
  end
end
