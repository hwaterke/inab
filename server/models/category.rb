DB.create_table? :categories do
  primary_key :id
  String :name, null: false, unique: true
  Integer :priority, null: false, default: 0
  DateTime :created_at, null: false
  DateTime :updated_at, null: false
  foreign_key :category_group_id, :category_groups, null: false
end

class Category < Sequel::Model
  many_to_one :category_group

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
