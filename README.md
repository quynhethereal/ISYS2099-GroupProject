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
  - Create a database called `lazada_ecommerce`
    // TODO: Add SQL instructions for creating the database + roles

```SQL
CREATE DATABASE IF NOT EXISTS lazada_ecommerce;
```

- Setup MongoDB database:
  - Create a database called `lazada_ecommerce`
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

- Run the server:

```bash
npm start
```

- Run the client:

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

- Finally, run the react app

```bash
npm start
```
