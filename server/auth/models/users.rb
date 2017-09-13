require 'digest'

DB.create_table? :users do
  uuid :uuid, primary_key: true
  String :email, null: false, unique: true
  String :password_digest
  TrueClass :is_admin, null: false, default: false
  DateTime :last_login
  Integer :password_failure_number, null: false, default: 0
  DateTime :password_failure_time
  DateTime :created_at, null: false
  DateTime :updated_at, null: false
end

class User < Sequel::Model
  plugin :secure_password

  def jwt_subject
    uuid
  end
end
