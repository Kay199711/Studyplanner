## 🛠️ Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations

## 🔧 Environment Variables

See `.env.example` for all available variables:
- `PORT` - Server port (default: 3000)
- `DATABASE_URL` - SQLite database file path
- `FRONTEND_URL` - Frontend URL for CORS
- `JWT_SECRET` - Secret for JWT tokens

## Folder Structure

```
backend/
├── src/
│   ├── index.js               # 🚀 Server entry point
│   ├── app.js                 # ⚙️ Express config 
│   ├── routes.js              # 🛣️ All route definitions
│   ├── config/
│   │   └── database.js        # 🗄️ Database connection
│   └── controllers/
│       ├── index.js           # 📦 Barrel export
│       └── authController.js  # 🔐 Auth logic
├── prisma/
│   ├── schema.prisma          # 📋 Database schema
│   └── seed.js                # 🌱 Seed data
└── package.json
```