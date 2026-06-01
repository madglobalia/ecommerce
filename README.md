# Full-Stack Ecommerce Application

A complete ecommerce platform built with Next.js (App Router), TypeScript, MongoDB, and TailwindCSS.

## Features

### Admin Panel
- **Admin Login**: Static credentials for admin access
- **Dashboard**: View total products sold, clients registered, and revenue generated
- **Product Management**: Add, edit, and delete products with stock management
- **Order Management**: View and update order statuses (Processing/Delivered)
- **Client Management**: View all registered clients with unique IDs
- **Stock Auto-Update**: Stock automatically decreases when products are sold

### Client Panel
- **User Authentication**: Signup and login with auto-generated unique IDs
- **Product Browsing**: View products with images, prices, and stock information
- **Shopping Cart**: Add products to cart and manage quantities
- **Order Placement**: Place orders with automatic stock deduction
- **Order History**: View past orders and their status

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Styling**: TailwindCSS
- **State Management**: Zustand (for cart and wishlist)
- **Authentication**: JWT tokens

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your-secret-key-here
ADMIN_ID=admin
ADMIN_PASSWORD=admin123
```

### Variable Descriptions

- `MONGODB_URI`: Connection string for your MongoDB database
- `JWT_SECRET`: Secret key for JWT token generation
- `ADMIN_ID`: Admin username for admin login (default: admin)
- `ADMIN_PASSWORD`: Admin password for admin login (default: admin123)

## Getting Started

1. **Install dependencies**:
```bash
npm install
```

2. **Set up environment variables**:
Create a `.env.local` file with the variables listed above

3. **Start MongoDB**:
Make sure MongoDB is running on your machine or use MongoDB Atlas

4. **Run the development server**:
```bash
npm run dev
```

5. **Open your browser**:
Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
ecommerce/
├── app/
│   ├── admin/              # Admin panel pages
│   │   ├── login/          # Admin login page
│   │   ├── dashboard/      # Admin dashboard
│   │   ├── products/       # Product management
│   │   ├── orders/         # Order management
│   │   └── clients/        # Client management
│   ├── auth/               # Client authentication
│   │   ├── signup/         # Client signup
│   │   └── login/          # Client login
│   ├── api/                # API routes
│   │   ├── products/       # Products CRUD
│   │   ├── orders/         # Orders CRUD
│   │   ├── auth/           # Authentication
│   │   └── admin/          # Admin APIs
│   ├── cart/               # Shopping cart page
│   ├── checkout/           # Checkout page
│   ├── orders/             # Client order history
│   ├── products/           # Product listing
│   └── page.tsx            # Home page
├── components/             # React components
├── lib/                    # Utility functions
│   └── mongodb.ts          # MongoDB connection
├── models/                 # Mongoose models
│   ├── Product.ts          # Product model
│   ├── User.ts             # User model
│   └── Order.ts            # Order model
├── store/                  # Zustand stores
│   ├── cartStore.ts        # Cart state management
│   └── wishlistStore.ts    # Wishlist state management
└── public/                 # Static assets
```

## API Routes

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create a new product (Admin only)
- `GET /api/products/[id]` - Get a single product
- `PUT /api/products/[id]` - Update a product (Admin only)
- `DELETE /api/products/[id]` - Delete a product (Admin only)

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user

### Orders
- `GET /api/orders` - Get all orders (Admin) or user orders (Client)
- `POST /api/orders` - Create a new order
- `PUT /api/orders/[id]` - Update order status (Admin only)
- `DELETE /api/orders/[id]` - Delete an order (Admin only)

### Admin
- `POST /api/admin/login` - Admin login
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/users` - Get all users

## Database Models

### Product
```typescript
{
  title: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  category: string;
  createdAt: Date;
}
```

### User
```typescript
{
  uniqueId: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}
```

### Order
```typescript
{
  productId: ObjectId;
  clientId: ObjectId;
  quantity: number;
  status: "Processing" | "Delivered";
  totalAmount: number;
  createdAt: Date;
}
```

## Usage

### Admin Access
1. Navigate to `/admin/login`
2. Login with admin credentials (default: admin / admin123)
3. Access dashboard to manage products, orders, and clients

### Client Access
1. Navigate to `/auth/signup` to create an account
2. Or navigate to `/auth/login` to sign in
3. Browse products at `/products`
4. Add items to cart and checkout
5. View order history at `/orders`

## Deployment

### Vercel
1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### MongoDB Atlas
For production, use MongoDB Atlas:
1. Create a free account at MongoDB Atlas
2. Create a cluster
3. Get your connection string
4. Update `MONGODB_URI` in environment variables

## License

MIT
