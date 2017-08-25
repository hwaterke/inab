DB.create_table? :locations do
  foreign_key :payee_uuid, :payees, on_delete: :cascade, type: 'uuid'
  Float :latitude, null: false
  Float :longitude, null: false
  DateTime :created_at, null: false
  DateTime :updated_at, null: false
  primary_key [:payee_uuid, :latitude, :longitude]
end

class Location < Sequel::Model
  many_to_one :payee, key: :payee_uuid
end

Location.unrestrict_primary_key
