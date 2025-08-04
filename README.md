# Packaging Request Management

A full-stack application to manage packaging requests and supplier responses, designed for customers, suppliers, and administrators.

## 🚀 Features

### 👤 Customer Module

- **Product Catalog**: View and filter active products
- **Cart System**: Add products to cart with quantity selection
- **Order Management**: Convert cart items to orders
- **Request Tracking**: View the status of created requests
- **Supplier Interests**: See masked supplier interest information

### 🏭 Supplier Module

- **Request Filtering**: Filter requests by product type
- **Request Details**: View order details
- **Interest Notification**: Mark interest or disinterest in requests

### 👨‍💼 Admin Module

- **User Management**: View and manage all users
- **Product Management**: Add, edit, and delete products
- **Order Tracking**: View all orders and supplier interests

## 📸 Screenshots

The application includes comprehensive screenshots demonstrating all major features and user interfaces. You can find all screenshots in the `screenshots/` directory.

### Key Screenshots:

- **Authentication**: Login and registration pages with modern UI design
- **Admin Dashboard**: User management, product catalog, and request management interfaces
- **Customer Interface**: Product browsing, cart management, and order tracking
- **Supplier Dashboard**: Request filtering, order details, and interest management
- **Deployment**: Railway deployment logs and application status

# Project Presentation

<!-- Visual frame for presentation images -->
<table align="center">
  <tr>
    <td><img src="screenshot/login.png" alt="Presentation 1" width="220"/></td>
    <td><img src="screenshot/register.png" alt="Presentation 2" width="220"/></td>
  </tr>
  <tr>
    <td><img src="screenshot/railway deploy.png" alt="Presentation 5" width="220"/></td>
    <td><img src="screenshot/admin talep incle.png" alt="Presentation 7" width="220"/></td>
  </tr>
  <tr>
    <td><img src="screenshot/filter.png" alt="Presentation 9" width="220"/></td>
    <td><img src="screenshot/customer product.png" alt="Presentation 12" width="220"/></td>
  </tr>

</table>

---

All screenshots are located in the `screenshots/` directory and can be accessed to see the complete user interface and functionality of the application.

## 🔧 Technical Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Material-UI, React Context, JWT Authentication, Toast Notifications
- **Backend**: NestJS, TypeORM, JWT Authentication
- **Database**: Relational DB or JSON mock data

## 📋 Requirements

- Node.js 18+
- npm or yarn

## 🛠️ Setup

### Backend

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   # or
   yarn install
   ```
2. **Configure environment variables:**
   - Create a `.env` file if needed (see project docs for details)
     ```env
     DATABASE_HOST=localhost
     DATABASE_PORT=5432
     DATABASE_USERNAME=postgres
     DATABASE_PASSWORD=1234
     DATABASE_NAME=paketera_db
     JWT_SECRET=yoursecretkey
     NODE_ENV=development
     ```
3. **Run the backend server:**
   ```bash
   npm run start:dev
   # or
   yarn start:dev
   ```
   The backend will run on `http://localhost:3001` by default.

### Frontend

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   # or
   yarn install
   ```
2. **Configure environment variables:**
   - Create a `.env.local` file:
     ```env
     NEXT_PUBLIC_API_URL=http://localhost:3001
     NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
     NODE_ENV=development
     ```
3. **Run the frontend app:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   The frontend will run on `http://localhost:3000` by default.

## 🏗️ Project Structure

```
packaging-request-management/
├── backend/
│   ├── src/
│   │   ├── app.module.ts
│   │   ├── main.ts
│   │   ├── auth/
│   │   ├── common/
│   │   ├── mock-data/
│   │   ├── orders/
│   │   ├── products/
│   │   ├── supplier-interests/
│   │   └── users/
│   ├── package.json
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── context/
│   │   ├── lib/
│   │   ├── locales/
│   │   ├── types/
│   │   └── utils/
│   ├── public/
│   ├── package.json
│   └── ...
└── README.md
```

## 🔌 API Endpoints

### Products

- `GET /products/active` - List active products
- `GET /products/types/active` - List active product types
- `GET /products/type/:type` - Filter products by type
- `GET /products/:id` - Get product details
- `GET /products` - List all products (Admin)
- `POST /products` - Create new product (Admin)
- `PATCH /products/:id` - Update product (Admin)
- `PATCH /products/:id/toggle` - Toggle product active status (Admin)
- `DELETE /products/:id` - Delete product (Admin)
- `GET /products/types` - List all product types (Admin)

### Orders

- `POST /orders` - Create new order
- `GET /orders/my-orders` - List customer orders
- `GET /orders/my-orders/:id` - Order details (with supplier interests)
- `GET /orders/product-type/:type` - Orders by product type
- `GET /orders` - List all orders (Admin)
- `GET /orders/with-supplier-interests` - All orders with supplier interests
- `GET /orders/with-supplier-interests/:id` - Order details with supplier interests
- `GET /orders/by-supplier-interest/:supplierId` - Orders by supplier interest
- `GET /orders/customer/:customerId` - Customer orders
- `GET /orders/:id` - Order details
- `DELETE /orders/:id` - Delete order (Admin)

### Authentication

- `POST /auth/login` - Login
- `GET /auth/profile` - Get user profile

### Users (Admin)

- `GET /users` - List all users
- `GET /users/:id` - Get user details
- `POST /users` - Create new user
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Supplier Interests

- `POST /supplier-interests` - Create supplier interest
- `GET /supplier-interests/my-interests` - List supplier interests
- `GET /supplier-interests/orders/by-product-types` - Orders by product types
- `GET /supplier-interests/orders/:orderId/detail` - Order details for supplier
- `POST /supplier-interests/orders/:orderId/toggle-interest` - Toggle interest status
- `GET /supplier-interests` - List all supplier interests (Admin)
- `GET /supplier-interests/order/:orderId` - Supplier interests for order
- `GET /supplier-interests/supplier/:supplierId` - Supplier interests (Admin)
- `GET /supplier-interests/:id` - Supplier interest details (Admin)
- `DELETE /supplier-interests/:id` - Delete supplier interest (Admin)

## 🔐 Security

- JWT-based authentication
- Role-based access control (RBAC)
- Protected routes for sensitive operations

## 📱 Responsive Design

- Mobile-friendly UI
- Tablet and desktop optimization
- Material-UI breakpoints
