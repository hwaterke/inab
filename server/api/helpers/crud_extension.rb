module Grape
  class API
    class << self

      # This extension assumes the Model has a primary key called 'id'

      def plural_of(type)
        type.name.pluralize.underscore.to_sym
      end

      def get_one(type, representer)
        desc "Returns one #{type}"
        params do
          requires :id, type: String, desc: "The id of the #{type}"
        end
        get ':id' do
          present_instance type, with: representer
        end
      end

      def get_all(type, representer)
        list_representer = Class.new(Grape::Roar::Decorator) do
          include ::Roar::JSON
          collection :entries, extend: representer, as: :data
        end

        desc "Returns all #{type}"
        get do
          present type.all, with: list_representer
        end
      end

      def create_with(type, representer, &block)
        desc "Creates a new #{type}"
        params(&block)
        post do
          create type, from: declared(params), with: representer
        end
      end

      def update_with(type, representer, &block)
        desc "Updates an existing #{type}"
        params do
          requires :id, type: String, desc: "The id of the #{type}"
          self.instance_eval(&block)
        end
        patch ':id' do
          entry = find_instance(type, params[:id])

          update_keys = declared(params).dup
          update_keys.delete(:id)

          entry.update(update_keys)
          present entry, with: representer
        end
      end

      def delete_one(type, representer)
        desc "Deletes an existing #{type}"
        params do
          requires :id, type: String, desc: "The id of the #{type}"
        end
        delete ':id' do
          entry = find_instance(type, params[:id])
          present entry.destroy, with: representer
        end
      end

      def crud(type, representer, &block)
        resource plural_of(type) do
          get_one(type, representer)
          get_all(type, representer)
          create_with(type, representer, &block)
          update_with(type, representer, &block)
          delete_one(type, representer)
        end
      end

    end
  end
end
