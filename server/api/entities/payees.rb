module INAB
  module Entities
    class EmbeddedLocationRepresenter < Grape::Roar::Decorator
      include ::Roar::JSON
      property :latitude
      property :longitude
    end

    class PayeeRepresenter < Grape::Roar::Decorator
      include ::Roar::JSON
      property :uuid
      property :name
      collection :locations, extend: EmbeddedLocationRepresenter
    end

    class Payees < Grape::API
      before {authenticate!}

      helpers CrudHelpersBuilder.create_for_user Payee
      helpers do
        params :instance_params do
          requires :name, type: String, desc: 'The name of the Payee'
          requires :locations, type: Array do
            requires :latitude, type: Float, desc: 'The latitude of the Location'
            requires :longitude, type: Float, desc: 'The latitude of the Location'
          end
        end
      end

      helpers do
        def create_instance(declared_params)
          creation_keys = declared_params.merge(user_uuid: connected_user.uuid)
          locations_provided = creation_keys.delete(:locations)

          Payee.db.transaction do
            payee = Payee.create(creation_keys)

            if locations_provided
              locations_provided.each do |location|
                payee.add_location(location)
              end
            end

            find_instance payee.uuid
          end
        end

        def update_instance(declared_params, entry)
          update_keys = declared_params.dup
          locations_provided = update_keys.delete(:locations)

          Payee.db.transaction do
            entry.update(update_keys)

            # Delete existing locations
            entry.locations.each {|location| location.destroy}

            # Create new locations
            if locations_provided
              locations_provided.each do |location|
                entry.add_location(location)
              end
            end
          end

          find_instance entry.uuid
        end
      end

      crud_routes Payee.name, PayeeRepresenter
    end
  end
end
