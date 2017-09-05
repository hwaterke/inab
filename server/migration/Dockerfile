FROM ruby:alpine
RUN apk add --update build-base sqlite-dev

WORKDIR /app/migration
COPY Gemfile* ./
RUN bundle install

COPY migrate.rb ./

ENTRYPOINT ["bundle", "exec", "ruby", "migrate.rb"]
