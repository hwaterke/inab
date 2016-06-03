# Simple Ruby Server to serve the database over a restful API.
# It is very basic and far from final but it will do for now.
# Compliance level to http://jsonapi.org is good enough.
# In the future it might be replaced by a NodeJS server.
require 'bundler'
Bundler.require

# Provides some syntactic sugar to CRUD a resource.
class Model
  attr_reader :resource
  def initialize(database, resource)
    @database = database
    @resource = resource.to_sym
    @dataset = @database[@resource]
  end

  def all
    @dataset.all
  end

  def find_by_id(id)
    @dataset.where(id: id).single_record
  end

  def create(values)
    # If an id is provided, save it as the client id.
    unless values['id'].nil?
      values['cid'] = values['id']
      values.delete 'id'
    end
    find_by_id(@dataset.insert(values))
  end

  def update(id, values)
    ['id', :id].each { |v| values.delete(v) }
    @dataset.where(id: id).update(values)
    find_by_id(id)
  end

  def delete(id)
    @dataset.where(id: id).delete
  end
end

# Defines the different route for a given resource.
def define_restful_api(model)
  get "/#{model.resource}" do
    catch_errors { json model.all }
  end

  get "/#{model.resource}/:id" do
    catch_errors do
      result = model.find_by_id(params[:id])
      halt 404 if result.nil?
      json result
    end
  end

  post "/#{model.resource}" do
    catch_errors { json model.create(JSON.parse(params[:data])) }
  end

  patch "/#{model.resource}/:id" do
    catch_errors { json model.update(params[:id], JSON.parse(params[:data])) }
  end

  delete "/#{model.resource}/:id" do
    catch_errors { model.delete(params[:id]) }
  end

  private
  def catch_errors()
    begin
      yield
    rescue Exception => e
      status 500
      json({'error' => e})
    end
  end
end


DB = Sequel.sqlite

DB.create_table? :accounts do
  primary_key :id
  String :name
  String :cid
end

DB.create_table? :transactions do
  primary_key :id
  Date :date
  String :payee
  String :category
  String :description
  Integer :amount # Amount in cents
  String :cid
  foreign_key :account_id, :accounts
end

define_restful_api(Model.new(DB, :accounts))
define_restful_api(Model.new(DB, :transactions))
