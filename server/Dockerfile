FROM ruby

RUN gem install bundler
WORKDIR /code/server
COPY Gemfile Gemfile.lock ./
RUN bundler install
CMD ["/usr/local/bin/ruby", "server.rb", "-o", "0.0.0.0"]
