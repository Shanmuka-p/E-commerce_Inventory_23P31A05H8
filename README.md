# 🛒 E-commerce Inventory Management System

## 📖 Executive Summary

The **E-commerce Inventory Management System** is a robust, high-throughput backend service designed to handle complex transactional logic in a distributed environment. Unlike standard CRUD applications, this system addresses critical engineering challenges such as **race conditions** (Double Booking), **real-time inventory reservation**, and **dynamic pricing strategies**.

Built with a layered architecture, the system leverages **Pessimistic Locking** (`SELECT ... FOR UPDATE`) within PostgreSQL transactions to guarantee ACID compliance during high-concurrency checkout events. It also employs a distributed job queue (BullMQ + Redis) to ensure data consistency by automatically reconciling expired cart reservations.

## 🚀 Key Features

### 🛡️ Concurrency & Data Integrity

* **Atomic Transactions:** All critical state changes (Add to Cart, Checkout) are wrapped in managed database transactions to prevent partial failures.

* **Pessimistic Locking:** Implements row-level locking to serialize access to high-demand inventory, effectively eliminating race conditions and overselling.

### 💸 Dynamic Pricing Engine

* **Strategy Pattern Implementation:** A flexible pricing service that applies stacked discounts in a deterministic order.

* **Rule Hierarchy:**

  1. **Base Price:** Product Base + Variant Adjustment.

  2. **Seasonal Rules:** Time-based promotional discounts.

  3. **Bulk Discounts:** Volume-based price reductions.

  4. **Tiered Pricing:** Customer-segment specific pricing (e.g., Gold Member rates).

### 📦 Smart Inventory Management

* **Soft Reservations:** Temporarily holds stock in a "reserved" state upon adding to cart, preventing others from purchasing the last item while the user browses.

* **Automated Cleanup:** A background worker process monitors reservations and automatically releases expired stock back to the available pool, ensuring inventory fluidity.

### 🏗️ Scalable Architecture

* **Separation of Concerns:** Strictly adheres to a Controller-Service-Repository pattern.

* **Containerization:** Fully Dockerized environment for the Database (PostgreSQL) and Cache (Redis), ensuring consistent deployments across environments.

## 🛠️ Technology Stack

| Category | Technology | Usage | 
 | ----- | ----- | ----- | 
| **Runtime** | Node.js (v20+) | Core execution environment. | 
| **Framework** | Express.js | REST API routing and middleware. | 
| **Database** | PostgreSQL | Primary relational data store. | 
| **ORM** | Sequelize | Schema modeling and transaction management. | 
| **Queue** | BullMQ & Redis | Asynchronous background job processing. | 
| **DevOps** | Docker Compose | Orchestration of DB and Redis services. | 

## 📂 Project Architecture

```text
E-commerce_Inventory_23P31A05H8/
├── config/
│   └── database.js        # Database connection configuration
├── controllers/
│   ├── CartController.js  # Handles incoming inventory requests
│   └── ProductController.js # Handles pricing inquiries
├── jobs/
│   ├── cleanupWorker.js   # Background worker for releasing stock
│   └── scheduler.js       # CRON-like scheduler for triggers
├── models/
│   ├── index.js           # Relationship definitions (Associations)
│   ├── Product.js         # Product entity
│   ├── Variant.js         # Inventory holder (Stock/SKU)
│   ├── Reservation.js     # Temporary cart lock entity
│   └── Category.js        # Hierarchical category structure
├── routes/
│   └── api.js             # RESTful route definitions
├── services/
│   ├── InventoryService.js # Core business logic (Locking/Transactions)
│   └── PricingService.js   # Pricing strategy logic
├── .env                   # Environment variables (Gitignored)
├── .gitignore             # Git exclusion rules
├── docker-compose.yml     # Infrastructure orchestration
├── index.js               # Application entry point
├── package.json           # Dependencies and scripts
└── test_logic.js          # Logic verification suite
