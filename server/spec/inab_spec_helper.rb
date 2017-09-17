require 'rack/test'

OUTER_APP = Rack::Builder.parse_file('config.ru').first

# Setup test data
require_relative 'test_data'

module INAB
  module Test
    module Helpers
      include Rack::Test::Methods

      def app
        OUTER_APP
      end

      def post_json(path, content)
        post(path, content.to_json, {'CONTENT_TYPE' => 'application/json'})
      end

      def patch_json(path, content)
        patch(path, content.to_json, {'CONTENT_TYPE' => 'application/json'})
      end

      def symbolize_keys(some_hash)
        result = {}
        some_hash.each_key do |key|
          result[(key.to_sym rescue key)] = some_hash[key]
        end
        result
      end
    end
  end
end

# Creates tests to make sure it is not possible to access a CRUD without a token
def no_crud_without_token(path)
  context 'without token' do
    context "GET /api/#{path}/uuid" do
      it 'requires authentication' do
        get "/api/#{path}/uuid"
        expect(last_response.status).to eq(401)
      end
    end

    context "GET /api/#{path}" do
      it 'requires authentication' do
        get "/api/#{path}"
        expect(last_response.status).to eq(401)
      end
    end

    context "POST /api/#{path}" do
      it 'requires authentication' do
        post_json "/api/#{path}", {name: 'Some name'}
        expect(last_response.status).to eq(401)
      end
    end

    context "PATCH /api/#{path}/uuid" do
      it 'requires authentication' do
        patch_json "/api/#{path}/uuid", {name: 'Some name'}
        expect(last_response.status).to eq(401)
      end
    end

    context "DELETE /api/#{path}/uuid" do
      it 'requires authentication' do
        delete "/api/#{path}/uuid"
        expect(last_response.status).to eq(401)
      end
    end
  end

end
