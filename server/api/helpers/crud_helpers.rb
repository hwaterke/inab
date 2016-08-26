module CrudHelpers
  def create(type, options = {})
    present type.create(options[:from]), with: options[:with]
  end

  def present_instance(type, options = {})
    present find_instance(type, params[:id]), with: options[:with]
  end

  def find_instance(type, primary_key)
    instance = type.with_pk(primary_key)
    error! :not_found, 404 unless instance
    instance
  end
end
