# fread.

Ecommerce Web Application built with the MERN Stack.

## 🏁 Get Started

1. **_Clone the repository_**

```sh
git clone https://github.com/FreadSt/fread.
```

2. **_Navigate to the repository directory_**

```sh
$ cd fread.
```

### 💻 Client

1. **_Navigate to the client directory_**

```sh
$ cd client
```

2. **_Install dependencies_**

```sh
$ npm install
```

#### Running

1. **_Compile and hot-reload for development_**

```sh
$ npm run dev
```

2. **_Compile for production_**

```sh
$ npm run build
```

### 💻 Server

1. **_Navigate to the server directory_**

```sh
$ cd server
```

2. **_Install dependencies_**

```sh
$ npm install
```

#### Running

1. **_Compile and hot-reload for development_**

```sh
$ npm run start
```

2. **_Compile for production_**

```sh
$ npm run build
```

## 💻 Built With

- **ReactJS**
- **TypeScript**
- **SocketIo**
- **redux-toolkit**
- **NodeJS**
- **ExpressJS**
- **MongoDB**
- **TailwindCSS**
- **Stripe**

## Deployment with

- frontend: Vercel
- backend: Render
- database: Mongo Atlas

## 📂 File Structure

```sh
|-- README.md
|-- client
|   |-- index.html
|   |-- package-lock.json
|   |-- package.json
|   |-- postcss.config.cjs
|   |-- public
|   |-- src
|   |   |-- App.tsx
|   |   |-- assets
|   |   |-- helpers
|   |   |-- layout
|   |   |   |--Announcement.tsx
|   |   |   |--Footer.tsx
|   |   |   |--Navbar.tsx
|   |   |   `--Newsletter.tsx
|   |   |-- constants
|   |   |   |--auth
|   |   |   `--chat
|   |   |-- components
|   |   |   |-- AdminChat.tsx
|   |   |   |-- AdminChatHeader.tsx
|   |   |   |-- AdminChatTicketList.tsx
|   |   |   |-- AdminChatMessages.tsx
|   |   |   |-- Carousel.tsx
|   |   |   |-- Chat.tsx
|   |   |   |-- CartProduct.tsx
|   |   |   |-- Category.tsx
|   |   |   |-- Categories.tsx
|   |   |   |-- Filter.tsx
|   |   |   |-- Newsletter.tsx
|   |   |   |-- Product.tsx
|   |   |   |-- Products.tsx
|   |   |   |-- ProtectedRoute.tsx
|   |   |   `-- Title.tsx
|   |   |-- index.css
|   |   |-- layout
|   |   |   |-- Announcement.tsx
|   |   |   |-- Footer.tsx
|   |   |   `-- Navbar.tsx
|   |   |-- main.tsx
|   |   |-- pages
|   |   |   |-- Home.tsx
|   |   |   |-- Login.tsx
|   |   |   |-- Orders.tsx
|   |   |   |-- ShoppingCart.tsx
|   |   |   |-- ShoppingCategory.tsx
|   |   |   |-- Signup.jsx
|   |   |   `-- LoadingFallBack.tsx
|   |   |   `-- AdminPanel.tsx
|   |   |   `-- Checkout.tsx
|   |   |   `-- SingleProduct.jsx
|   |   |-- request-methods.ts
|   |   `-- store
|   |       |-- auth-actions.ts
|   |       |-- auth-slice.ts
|   |       |-- cart-slice.ts
|   |       `-- index.ts
|   |-- layout.tsx
|   |-- tailwind.config.cjs
|   `-- vite.config.ts
`-- server
    |-- controllers
    |   |-- auth.js
    |   |-- cart.js
    |   |-- order.js
    |   |-- product.js
    |   `-- user.js
    |-- db
    |   |-- cleanup-script.js
    |   |-- fake-api-products.json
    |   `-- products.json
    |-- index.ts
    |-- middlewares
    |   `-- verifyToken.js
    |-- models
    |   |-- Cart.js
    |   |-- Order.js
    |   |-- Product.js
    |   |-- Message.js
    |   `-- User.js
    |-- package-lock.json
    |-- package.json
    `-- routes
        |-- auth.js
        |-- chat.js
        |-- stripe.js
        |-- auth.js
        |-- cart.js
        |-- order.js
        |-- product.js
        |-- stripe.js
        `-- user.js
```

Changes, upgrades and new features
- migrated from js to ts
- chat with admin (backend and frontend)
- implemented roles (admin/customer)
- AdminPanel page with product adding and chatting with users
- redesign product cards
- reworked flow of cart behavior with added products and logged user
- full deployment backend, frontend and db
- optimized renders using useCallback(), useMemo() and lazy
- added mock db cluster for demo
- updated dependencies
- added test Stripe flow
- Checkout page with Stripe
- added some changes into architecture: 
   Replaced layout components from pages into root layout 
- added route protection and fallback
- added validation onto auth page

