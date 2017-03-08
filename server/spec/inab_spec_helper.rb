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
    end
  end
end
