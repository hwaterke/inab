require_relative 'inab_spec_helper'

describe INAB::Entities::Settings do
  include INAB::Test::Helpers

  context 'without token' do
    context 'GET /api/settings' do
      it 'requires authentication' do
        get '/api/settings/schema_version'
        expect(last_response.status).to eq(401)
      end
    end

    [:get, :patch].each do |verb|
      [:schema_version, :registration].each do |word|
        context "GET /api/settings/#{word}" do
          it 'requires authentication' do
            if verb == :get
              get "/api/settings/#{word}"
            else
              patch "/api/settings/#{word}"
            end
            expect(last_response.status).to eq(401)
          end
        end
      end
    end
  end

  context 'when logged in' do
    before do
      post_json '/api/login', {email: 'harold', password: '123'}
      @token = last_response.headers['Authorization']
    end

    context 'GET /api/settings' do
      it 'returns all settings' do
        header 'Authorization', @token
        get '/api/settings'
        expect(last_response.status).to eq(200)
        expect(JSON.parse(last_response.body)).to eq({
          "data" =>
            [
              {"key" => "schema_version", "value" => "1"},
              {"key" => "registration", "value" => "1"}
            ]
        })
      end
    end

    context 'PATCH /api/settings/registration' do
      it 'updates registration setting' do
        header 'Authorization', @token
        patch_json '/api/settings/registration', value: '0'
        expect(last_response.status).to eq(200)
        expect(JSON.parse(last_response.body)).to eq({
          "key" => "registration",
          "value" => "0"
        })
      end
    end

    context 'PATCH /api/settings/schema_version' do
      it 'updates schema_version setting' do
        header 'Authorization', @token
        patch_json '/api/settings/schema_version', value: '0'
        expect(last_response.status).to eq(403)
        expect(JSON.parse(last_response.body)).to eq({
          "error" => "Forbidden",
          "message" => "This value cannot be changed"
        })
      end
    end
  end
end
