# MySMS Messenger - Backend API

Ruby on Rails API backend for MySMS Messenger.

## Requirements

- Ruby 3.4+
- Rails 8.1+
- MongoDB 7+

## Setup

```bash
cp .env.example .env
bundle install
rails server
```

## Health Check

```
GET /health
```

Returns MongoDB connectivity status.
