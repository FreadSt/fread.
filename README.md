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
- **Redux**
- **NodeJS**
- **ExpressJS**
- **MongoDB**
- **TailwindCSS**
- **Stripe**

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
|   |   |-- components
|   |   |   |-- Carousel.tsx
|   |   |   |-- CartProduct.tsx
|   |   |   |-- Category.tsx
|   |   |   |-- Categories.tsx
|   |   |   |-- Filter.tsx
|   |   |   |-- Newsletter.tsx
|   |   |   |-- Product.tsx
|   |   |   |-- Products.tsx
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
|   |   |   `-- SingleProduct.jsx
|   |   |-- request-methods.ts
|   |   `-- store
|   |       |-- auth-actions.ts
|   |       |-- auth-slice.ts
|   |       |-- cart-slice.ts
|   |       `-- index.ts
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
    |   `-- User.js
    |-- package-lock.json
    |-- package.json
    `-- routes
        |-- auth.js
        |-- cart.js
        |-- order.js
        |-- product.js
        |-- stripe.js
        `-- user.js
```

## 📷 Screenshots

- ### Large Screens
  ![large screens](ss/large/home.png)
  <br>
  ![large screens](ss/large/productcategorie.png)
  <br>
  ![large screens](ss/large/singleproduct.png)
  <br>
  ![large screens](ss/large/shoppingcart.png)
  <br>
  ![large screens](ss/large/signup.png)
  <br>
  ![large screens](ss/large/login.png)

