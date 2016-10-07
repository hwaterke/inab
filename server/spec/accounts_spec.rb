require "rack/test"

OUTER_APP = Rack::Builder.parse_file('config.ru').first

describe INAB::API do
  include Rack::Test::Methods

  def app
    OUTER_APP
  end

  context 'GET /api/accounts' do
    it 'returns an empty array of accounts' do
      get '/api/accounts'
      expect(last_response.status).to eq(200)
      expect(JSON.parse(last_response.body)).to eq({"data" => []})
    end
  end
end