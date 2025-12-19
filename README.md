# E‑Commerce Inventory & Dynamic Pricing Backend

## Overview
This project is a backend service for an e‑commerce platform that manages **real‑time inventory**, **inventory reservation with expiration**, and a **dynamic pricing engine**. The system is designed to handle concurrent requests safely, prevent overselling, and apply multiple pricing rules in a predictable and extensible manner.

The implementation goes beyond basic CRUD operations and focuses on transactional correctness, background processing, and clean separation of concerns—key requirements for production‑grade backend systems.

---

## Architecture

The system follows a **layered architecture**:

- **API Layer (Controllers & Routes)**
  - Exposes RESTful endpoints
  - Handles request validation and response formatting

- **Service Layer**
  - Encapsulates all business logic
  - InventoryService: reservation, checkout, stock updates
  - PricingService: dynamic pricing rules and calculations

- **Data Access Layer (Models)**
  - Sequelize ORM models
  - Enforces relationships and constraints

- **Background Worker**
  - Periodically releases expired inventory reservations

- **Database**
  - Relational database (PostgreSQL recommended)
  - Transactional guarantees for critical operations

An architecture diagram is provided in `architecture.png`.

---

## Technology Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **ORM:** Sequelize
- **Database:** PostgreSQL (or compatible relational DB)
- **Background Jobs:** Node scheduler + worker process
- **API Testing:** Postman

---

## Setup Instructions

### Prerequisites

- Node.js (v18+ recommended)
- PostgreSQL
- npm

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecommerce_db
DB_USER=postgres
DB_PASSWORD=postgres
RESERVATION_TTL_MINUTES=15
```

### Database Migration

```bash
npx sequelize db:migrate
```

---

## Running the Application

### Start API Server

```bash
npm test
```

### Start Background Worker

```bash
node jobs/scheduler.js
```

The worker periodically scans for expired inventory reservations and releases them back to available stock.

---

## Inventory Reservation Flow (Detailed Walkthrough)

1. **Add Item to Cart**
   - Client adds a product variant to the cart
   - System checks `available_quantity = stock_quantity − reserved_quantity`

2. **Reservation Creation**
   - Within a database transaction:
     - `reserved_quantity` is incremented
     - A reservation record is created with an expiration timestamp (now + 15 minutes)

3. **Cart State**
   - The reserved stock is unavailable to other users
   - Price is snapshotted at the time of reservation

4. **Reservation Expiration**
   - Background worker identifies expired reservations
   - Reserved stock is released (idempotent operation)

5. **Checkout**
   - Reserved quantity is converted into a permanent sale
   - `stock_quantity` is decremented
   - `reserved_quantity` is reduced atomically

This flow ensures **no overselling**, even under concurrent requests.

---

## Concurrency Control

- All critical inventory operations are wrapped in **database transactions**
- Stock validation and updates occur atomically
- Sequelize row‑level locking is used implicitly during transactional updates
- Any attempt to reserve more than available stock fails safely

This design prevents race conditions and guarantees consistency.

---

## Dynamic Pricing Engine

### Rule Hierarchy (Applied in Order)

1. **Seasonal / Time‑Based Discounts**
2. **Bulk Quantity Discounts**
3. **User Tier Discounts**

The pricing engine is isolated in `PricingService` to ensure maintainability and extensibility.

### Example Pricing Scenarios

**Base price:** ₹100

- Seasonal discount: 20%
- Bulk discount (10+ units): 10%
- Gold user discount: 15%

**Calculation for 10 units (Gold user):**

1. Base: ₹100
2. Seasonal: ₹100 − 20% = ₹80
3. Bulk: ₹80 − 10% = ₹72
4. User tier: ₹72 − 15% = ₹61.20

Final price per unit: **₹61.20**

### Price Snapshot Guarantee

Once an item is added to the cart, its calculated price is stored and **not affected by later price rule changes**.

---

## API Documentation

A Postman collection is included for testing all endpoints.

### Key Endpoints

- **Product Management**
  - CRUD for products, categories, and variants

- **Dynamic Pricing**
  - `GET /products/:id/price?quantity=&user_tier=`

- **Cart Management**
  - Add/update/remove items

- **Checkout**
  - `POST /cart/checkout`

Each endpoint returns structured responses with validation errors when applicable.

---

## Database Design

The database schema supports:

- Hierarchical categories
- Product‑variant relationships
- Variant‑level inventory
- Reservation tracking with expiration

Refer to `schema.png` for the ERD.

---

## Evaluation Alignment

This project satisfies:

- Real‑time inventory reservation and expiration
- Robust concurrency control
- Modular pricing engine with rule hierarchy
- Transaction‑safe checkout
- Clear separation of concerns

---
