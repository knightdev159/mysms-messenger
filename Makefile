.PHONY: setup dev dev-backend dev-frontend test test-backend test-frontend lint

setup:
	cd backend && bundle install
	cd frontend && npm install

dev-backend:
	cd backend && rails server -p 3000

dev-frontend:
	cd frontend && ng serve --proxy-config proxy.conf.json

test-backend:
	cd backend && bundle exec rspec

test-frontend:
	cd frontend && ng test --watch=false

test: test-backend test-frontend

lint:
	cd backend && bundle exec rubocop
	cd frontend && ng lint
