ARG RUBY_VERSION=3.4
FROM ruby:${RUBY_VERSION}-slim AS base
WORKDIR /app

RUN apt-get update -qq && apt-get install --no-install-recommends -y curl build-essential libyaml-dev && rm -rf /var/lib/apt/lists/*

ENV RAILS_ENV=production
ENV BUNDLE_DEPLOYMENT=1
ENV BUNDLE_PATH=/usr/local/bundle

COPY Gemfile Gemfile.lock ./
RUN bundle config set --local without 'development test' && bundle install

COPY . .
EXPOSE 3000
CMD ["bundle", "exec", "puma", "-C", "config/puma.rb"]
