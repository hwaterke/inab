DB.create_table? :accounts do
  uuid :uuid, primary_key: true
  foreign_key :user_uuid, :users, null: false, type: 'uuid'
  String :name, null: false, unique: true
  DateTime :created_at, null: false
  DateTime :updated_at, null: false
end

class Account < Sequel::Model
  many_to_one :user, key: :user_uuid

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
