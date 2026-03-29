# Study planner - INIT BUILD project

### Tech stack
- **Frontend**: React + Tailwind CSS
- **Backend**: Express
- **Database**: SQLite + Prisma ORM

### Running the Frontend
```bash
cd frontend

npm install

cp .env.example .env

npm run dev
```

### Running the Backend
```bash
cd backend

npm install

cp .env.example .env

# Generate Prisma Client
npm run prisma:generate
# Run database migrations
npm run prisma:migrate
# This creates /backend/prisma/db.sqlite

npm run dev
```

### Before Contributing

- Read [CONTRIBUTING.md](CONTRIBUTING.md)

test

add code 
=============
git add .
git commit -m "message"
git push 
=============

get code
=================
git pull origin branchName
==================

update remote branches like pull from the internet
===========
git fetch
=========