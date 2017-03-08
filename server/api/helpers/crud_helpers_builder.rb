module CrudHelpersBuilder

  def self.create_basic(type)
    Module.new do

      define_method :type do
        type
      end

      def find_instance(query_parameter_id)
        instance = type.with_pk query_parameter_id
        error! :not_found, 404 unless instance
        instance
      end

      def find_instances
        type.all
      end

      def create_instance(declared_params)
        type.create(declared_params)
      end

      def update_instance(declared_params, entry)
        entry.update(declared_params)
      end

      def delete_instance(entry)
        entry.destroy
      end

    end
  end

  def self.create_for_user(type)
    Module.new do

      define_method :type do
        type
      end

      def find_instance(query_parameter_id)
        instance = type.first(uuid: query_parameter_id, user_uuid: connected_user.uuid)
        error! :not_found, 404 unless instance
        instance
      end

      def find_instances
        type.where(user_uuid: connected_user.uuid).all
      end

      def create_instance(declared_params)
        declared_params.update(user_uuid: connected_user.uuid)
        type.create(declared_params)
      end

      def update_instance(declared_params, entry)
        entry.update(declared_params)
      end

      def delete_instance(entry)
        entry.destroy
      end

    end
  end

end
