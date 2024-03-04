# ISYS2099 - Database Project

## Table of Contents
- [Setup instructions](#Setup-instructions)
  - [Setup MySQL database](#setup-mysql-database)
  - [Setup MongoDB database](#setup-mongodb-database)
  - [Environment variables setup](#environment-variables-setup)
  - [Start BE locally](#start-be-locally)
  - [Start FE locally](#start-fe-locally)
- [Features](#features)
  - [Customer](#customer)
  - [Seller](#seller)
  - [Admin](#admin)

## Setup instructions

- First, clone the repo:

```bash
git clone
```

- Then, install the dependencies:

```bash
npm install
```

### Setup MySQL database:

- Login to the mysql shell and create a database called `lazada_ecommerce`

```SQL
CREATE DATABASE lazada_ecommerce;
```

- Populate seed data by **copying the SQL files** in `user_funcs.sql` and `seed.sql` in **script** folder (must be in exact order!).

### Setup MongoDB database:

- Ensure that packages of MongoDB and Mongoose are installed
- Start the MongoDB services on your device
- (Optional) Uncomment line 15-22 in `index.js` to drop existing database
- Run the server and the database will be created automatically if it does not exist

### Environment variables setup:

- Create a `.env` file from the sample and fill in your own credentials:

```bash
(macos)
cp .env.dev.sample .env
```

```bash
(windows)
copy .env.dev.sample .env
```

### Start BE locally:

- Run the server:

```bash
npm start
```

**Debug Notes:**

- If mySQL refuses connection on server startup, try changing MYSQL_HOST=127.0.0.1 in .env file.

### Start FE locally:

- Navigate to the FE server:

```bash
cd src/frontend
```

- First, install the dependencies:

```bash
npm install
```

- Then, create `.env` file copied from the sample and fill in your own config:

```bash
cp .env.dev.sample .env
```

- Finally, run the React app

```bash
npm start
```

### Contribution score:

```bash
Le Dinh Ngoc Quynh – s3791159 (5)

Truong Bach Minh – s3891909 (5)

Nguyen Vu Thuy Duong – s3865443 (5)

Le Cam Tu – s3915195 (5)
```

## Features

**All the user can login when first run the website**
<p align="center" height="400px">
  <kbd> 
    <img src="https://github.com/quynhethereal/ISYS2099-GroupProject/assets/86811396/25cddd0d-da47-4b28-9d4c-14df91888104" width="100%" height="100%" alt="login src">
  </kbd>
</p>


### Customer

**- Search product by name, description, price and category**
<p align="center" height="400px">
  <kbd style="object-fit: fill;"> 
    <img src="https://github.com/quynhethereal/ISYS2099-GroupProject/assets/86811396/ae13a9ca-790e-4bd1-97d0-bb1424982c1e" width="100%" height="100%" alt="search src">
  </kbd>
</p>

**- View product details**
<p align="center" height="400px">
   <kbd> 
    <img src="https://github.com/quynhethereal/ISYS2099-GroupProject/assets/86811396/0920f444-efcc-4b6a-808b-6362305f62de" width="100%" height="100%" alt="search src">
   </kbd>
</p>

**- Create order after adding its to cart**
 <p align="center" height="400px">
   <kbd> 
     <img src="https://github.com/quynhethereal/ISYS2099-GroupProject/assets/86811396/81a10a8d-15ca-47b0-b353-530ed6dc1bd5" width="100%" height="100%" alt="search src">
   </kbd>
</p>

**- Order status and details**
 <div style="width: 100%; height: 200px;">
   <kbd>
      <img src="https://github.com/quynhethereal/ISYS2099-GroupProject/assets/86811396/8c65d64d-282b-48f4-bd76-5e63e9815424" style="width: 100%; object-fit: cover; height: auto;" alt="order_status src">
   </kbd>
   <kbd>
      <img src="https://github.com/quynhethereal/ISYS2099-GroupProject/assets/86811396/37b1e1a9-9301-427e-ac79-4e4047404a3f" style="width: 100%; object-fit: cover; height: auto;" alt="order_detail src">
   </kbd>
</div>

### Seller

**- View, Create, Delete and Update products**
<p align="center" height="400px">
   <kbd> 
     <img src="https://github.com/quynhethereal/ISYS2099-GroupProject/assets/86811396/cb7f2b56-d25d-4ef9-a683-66ed4e7ec56f" width="100%" height="100%" alt="search src">
   </kbd>
</p>

<p align="center" height="400px">
   <kbd> 
     <img src="https://github.com/quynhethereal/ISYS2099-GroupProject/assets/86811396/db256b11-6577-4624-99f2-6e5d81e4698f" width="100%" height="100%" alt="search src">
   </kbd>
  
</p>

<p align="center" height="400px">
   <kbd> 
     <img src="https://github.com/quynhethereal/ISYS2099-GroupProject/assets/86811396/5dd8450e-3434-41c5-9aca-bd78cb6d2cc1" width="100%" height="100%" alt="search src">
   </kbd>
</p>

### Admin

**- View information of all warehouses and storage status**
<p align="center" height="400px">
   <kbd> 
     <img src="https://github.com/quynhethereal/ISYS2099-GroupProject/assets/86811396/0f16202e-2583-4fdd-a2e0-bb8320672c2d" width="100%" height="100%" alt="search src">
   </kbd>
</p>

**- Move products between warehouses**
<p align="center" height="400px">
   <kbd> 
     <img src="https://github.com/quynhethereal/ISYS2099-GroupProject/assets/86811396/0a471317-a763-4572-b7b3-adf0880766cd" width="100%" height="100%" alt="search src">
   </kbd>
</p>

**- View all available products in warehouse**
<p align="center" height="400px">
   <kbd> 
     <img src="https://github.com/quynhethereal/ISYS2099-GroupProject/assets/86811396/30bc5f18-f9dd-4916-9a69-ff079156bf8a" width="100%" height="100%" alt="search src">
   </kbd>
</p>

**- Category management (create, delete, update parent categories and sub categories)**
<p align="center" height="400px">
   <kbd> 
     <img src="https://github.com/quynhethereal/ISYS2099-GroupProject/assets/86811396/1d49ced6-7ba7-4339-92dc-b3c8f426bcd9" width="100%" height="100%" alt="search src">
   </kbd>
</p>
