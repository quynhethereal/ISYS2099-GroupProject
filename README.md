# ISYS2099 - Database Project

## Setup instructions

- First, clone the repo:

```bash
git clone
```

- Then, install the dependencies:

```bash
npm install
```

### Setup **MySQL** database:

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

### Start the server locally:

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

### Video demonstration URL:
https://rmiteduau-my.sharepoint.com/personal/s3915195_rmit_edu_vn/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fs3915195%5Frmit%5Fedu%5Fvn%2FDocuments%2FDatabase%20Application%20Resources&view=0
