module Grape
  class API
    class << self

      # Adds a route to the API for retreiving one instance
      def get_one_route(resource_name, representer)
        desc "Returns one #{resource_name}"
        params do
          requires :query_parameter_id, type: String, desc: "The id of the #{resource_name}"
        end
        get ':query_parameter_id' do
          present find_instance(params[:query_parameter_id]), with: representer
        end
      end

      # Adds a route to the API for retreiving all instances
      def get_all_route(resource_name, representer)
        list_representer = Class.new(Grape::Roar::Decorator) do
          include ::Roar::JSON
          collection :entries, extend: representer, as: :data
        end

        desc "Returns all #{resource_name}"
        get do
          present find_instances, with: list_representer
        end
      end

      # Adds a route to the API to create a new instance
      def create_route(resource_name, representer)
        desc "Creates a new #{resource_name}"
        params do
          use :instance_params
        end
        post do
          present create_instance(declared(params)), with: representer
        end
      end

      # Adds a route to the API to update an existing instance
      def update_route(resource_name, representer)
        desc "Updates an existing #{resource_name}"
        params do
          requires :query_parameter_id, type: String, desc: "The id of the #{resource_name}"
          use :instance_params
        end
        patch ':query_parameter_id' do
          entry = find_instance(params[:query_parameter_id])

          update_keys = declared(params).dup
          update_keys.delete(:query_parameter_id)

          present update_instance(update_keys, entry), with: representer
        end
      end

      # Adds a route to the API to delete an existing instance
      def delete_route(resource_name)
        desc "Deletes an existing #{resource_name}"
        params do
          requires :query_parameter_id, type: String, desc: "The id of the #{resource_name}"
        end
        delete ':query_parameter_id' do
          delete_instance(find_instance(params[:query_parameter_id]))
          body false
        end
      end

      def crud_routes(resource_name, representer)
        resource resource_name.pluralize.underscore.to_sym do
          get_one_route resource_name, representer
          get_all_route resource_name, representer
          create_route resource_name, representer
          update_route resource_name, representer
          delete_route resource_name
        end
      end

    end
  end
end
