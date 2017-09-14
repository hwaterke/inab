module INAB
  module Entities

    class SettingRepresenter < Grape::Roar::Decorator
      include ::Roar::JSON
      property :key
      property :value
    end

    class Settings < Grape::API
      before {authenticate!}

      helpers CrudHelpersBuilder.create_basic SystemSetting

      resource :settings do
        get_one_route :Setting, SettingRepresenter
        get_all_route :Setting, SettingRepresenter

        params do
          requires :query_parameter_id, type: String, desc: "The id of the SystemSetting"
          requires :value, type: String, desc: 'The value of the SystemSetting'
        end
        patch ':query_parameter_id' do
          unless env['warden'].user.is_admin
            error!({error: 'Forbidden', message: 'You are not an administrator.'}, 403)
            return
          end

          entry = find_instance(params[:query_parameter_id])

          unless params[:query_parameter_id] === 'registration'
            error!({error: 'Forbidden', message: 'This value cannot be changed'}, 403)
            return
          end

          update_keys = declared(params).dup
          update_keys.delete(:query_parameter_id)

          present update_instance(update_keys, entry), with: SettingRepresenter
        end
      end
    end
  end
end
