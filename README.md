# ISYS2099 - Database Project

## Setup instruction

- First, clone the repo:

```bash
git clone
```

- Then, install the dependencies:

```bash
npm install
```

- Setup **MySQL** database:
  - Login to the mysql shell and create a database called `lazada_ecommerce`
```SQL
CREATE DATABASE lazada_ecommerce;
```

- Setup MongoDB database:
  - Ensure that packages of MongoDB and Mongoose are installed
  - Start the MongoDB services on your device
- Populate the database with sample data:

```bash
// TODO
```

- Create a `.env` file from the sample and fill in your own credentials:

```bash
(macos)
cp .env.dev.sample .env
```
```bash
(windows)
copy .env.dev.sample .env
```
- Populate seed data by **copying the SQL files** in `user_funcs.sql` and `seed.sql` in **script** folder (must be in exact order!).
  
- Run the server:

```bash
npm start
```

**Debug Notes:**
- If mySQL refuses connection on server startup, try changing MYSQL_HOST=127.0.0.1 in .env file. 


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
