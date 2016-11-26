DB.create_table? :category_groups do
  primary_key :id
  String :name, null: false, unique: true
  Integer :priority, null: false, default: 0
  DateTime :created_at, null: false
  DateTime :updated_at, null: false
end

class CategoryGroup < Sequel::Model
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
