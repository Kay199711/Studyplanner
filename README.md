# Study planner for BUILD

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

npm run dev
```