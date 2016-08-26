DB.create_table? :accounts do
  primary_key :id
  String :name, null: false, unique: true
  DateTime :created_at, null: false
  DateTime :updated_at, null: false
end

class Account < Sequel::Model
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
