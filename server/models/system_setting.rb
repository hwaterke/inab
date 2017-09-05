DB.create_table? :system_settings do
  String :key, primary_key: true
  String :value
  DateTime :created_at, null: false
  DateTime :updated_at, null: false
end

class SystemSetting < Sequel::Model

end

SystemSetting.unrestrict_primary_key
