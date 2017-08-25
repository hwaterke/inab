DB.create_table? :categories do
  uuid :uuid, primary_key: true
  foreign_key :user_uuid, :users, null: false, type: 'uuid'
  foreign_key :category_group_uuid, :category_groups, null: false, type: 'uuid'
  String :name, null: false, unique: true
  Integer :priority, null: false, default: 0
  DateTime :created_at, null: false
  DateTime :updated_at, null: false
end

class Category < Sequel::Model
  many_to_one :user, key: :user_uuid
  many_to_one :category_group, key: :category_group_uuid
end
