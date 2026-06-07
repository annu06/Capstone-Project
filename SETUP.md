# Blockchain Shipment Tracking — JS/TS Rewrite

## Stack
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + Bootstrap 5 + React Query + Socket.io
- **Backend**: Node.js + Express + TypeScript + Prisma ORM + Socket.io + JWT
- **Database**: AWS RDS (PostgreSQL)

---

## Prerequisites
- Node.js 20+
- AWS RDS PostgreSQL instance (or local PostgreSQL for dev)

---

## Quick Start (Local Development)

### 1. Clone & configure

```bash
cd blockchain-shipment-tracking-js/backend
cp .env.example .env
# Edit .env and set DATABASE_URL to your AWS RDS endpoint or local postgres
```

### 2. Backend Setup

```bash
cd backend
npm install
npm run db:generate          # Generate Prisma client
npm run db:migrate           # Apply migrations to RDS
npm run db:seed              # Seed demo users
npm run dev                  # Start backend on :5000
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev                  # Start Vite dev server on :3000
```

---

## AWS RDS Connection String Format

```
DATABASE_URL="postgresql://USER:PASSWORD@your-rds-endpoint.us-east-1.rds.amazonaws.com:5432/blockchain_shipment_tracking"
```

- In AWS RDS, create a PostgreSQL 15/16 database instance
- Allow inbound connections on port 5432 from your server's security group
- Create a database named `blockchain_shipment_tracking`

---

## Demo Accounts (after seeding)

| Email                      | Password       | Role             |
|----------------------------|----------------|------------------|
| admin@shiptrack.com        | Admin@123      | Admin            |
| shipper@shiptrack.com      | Shipper@123    | Shipper          |
| consignee@shiptrack.com    | Consignee@123  | Consignee        |
| forwarder@shiptrack.com    | Forward@123    | Freight_Forwarder|

---

## API Endpoints

### Auth
| Method | Path                     | Description         |
|--------|--------------------------|---------------------|
| POST   | /api/auth/login          | Login               |
| POST   | /api/auth/refresh        | Refresh token       |
| POST   | /api/auth/logout         | Logout              |
| GET    | /api/auth/me             | Current user        |

### Couriers
| Method | Path                             | Access          |
|--------|----------------------------------|-----------------|
| GET    | /api/couriers                    | All roles       |
| POST   | /api/couriers                    | Shipper         |
| GET    | /api/couriers/:id                | All roles       |
| PUT    | /api/couriers/:id                | Shipper (owner) |
| DELETE | /api/couriers/:id                | Shipper (owner) |
| GET    | /api/couriers/tracking/:trackingId | All roles     |

### Transactions
| Method | Path                            | Access    |
|--------|---------------------------------|-----------|
| GET    | /api/transactions/:trackingId   | All roles |
| POST   | /api/transactions/:trackingId   | All roles |

### Tracking
| Method | Path                           | Access    |
|--------|--------------------------------|-----------|
| GET    | /api/tracking/search?trackingId=| Public   |

### Admin
| Method | Path                              | Access |
|--------|-----------------------------------|--------|
| GET    | /api/admin/users                  | Admin  |
| POST   | /api/admin/users                  | Admin  |
| PUT    | /api/admin/users/:id              | Admin  |
| DELETE | /api/admin/users/:id              | Admin  |
| GET    | /api/admin/audit-log              | Admin  |
| GET    | /api/admin/courier-search         | Admin  |
| GET    | /api/admin/tampered-couriers      | Admin  |

### Notifications
| Method | Path                             | Access    |
|--------|----------------------------------|-----------|
| GET    | /api/notifications               | All roles |
| GET    | /api/notifications/unread-count  | All roles |
| PUT    | /api/notifications/:id/read      | All roles |
| PUT    | /api/notifications/mark-all-read | All roles |

---

## Docker Compose (Local Dev with local Postgres)

```bash
docker-compose up --build
```

> For production, set DATABASE_URL to your AWS RDS endpoint in the environment.

---

## Production Deployment

1. Set all environment variables on your server/ECS task
2. Run `npm run db:migrate` on first deploy
3. Build frontend: `npm run build` → deploy `dist/` to S3 + CloudFront
4. Deploy backend to EC2 / ECS / Lambda (with `npm start`)

---

## Features
- JWT authentication with refresh tokens (30min access / 7day refresh)
- Role-based access control: Admin, Shipper, Consignee, Freight_Forwarder, Shipping_Line
- Account lockout after 5 failed attempts (15 minutes)
- SHA-256 blockchain hash chaining for tamper detection
- Real-time notifications via Socket.io
- Full audit trail (immutable, paginated)
- Courier management with tracking ID generation
- Transaction history with blockchain integrity verification
- Admin dashboard with tampered courier detection
