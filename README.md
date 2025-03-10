# Star Wars API

## 📌 Overview

This application is built with **NestJS** and uses **PostgreSQL** with **Prisma** as the ORM. It also utilizes **axios** to interact with the [Star Wars API (swapi)](https://swapi.dev/).

It gives you the ability to retrieve every movie from the Star Wars API and every movie from the system database.
An admin user can create, update or delete a new movie that doesn't exist in the Star Wars API and it will be stored on our DB.

## 🚀 Technologies Used

- **NestJS** - Backend framework
- **PostgreSQL** - Database
- **Prisma** - ORM for database management
- **axios** - HTTP client for making requests to the Star Wars API

## 📂 How to Run the Application

### 1️⃣ Install Yarn

Ensure that you have Yarn installed on your machine. If not, you can install it following the official guide: [Yarn Installation](https://classic.yarnpkg.com/lang/en/docs/install).

### 2️⃣ Navigate to the project folder

```bash
cd "folder app name"
```

### 3️⃣ Create a `.env` file with the variables that were provided

### 4️⃣ Install dependencies

```bash
yarn install
# or
yarn
```

### 5️⃣ Set up Docker and PostgreSQL

Make sure Docker and Docker Compose are installed. If they are not, you can install them from [Docker's official website](https://docs.docker.com/compose/install).

Run the following command to start the PostgreSQL container:

```bash
docker-compose up -d
```

This will start the PostgreSQL container in detached mode.

Run the following commands to set up the database and generate the necessary Prisma files:

```bash
yarn prisma migrate dev
yarn prisma generate
yarn prisma db seed
```

### 6️⃣ Start the application

```bash
yarn dev
```

## 📌 Main Business Logic

The core logic of the application is inside the `movie.service.ts`.

---

### 7️⃣ Access API Documentation

Once the application is running, you can access the Swagger documentation at: [http://localhost:8000/docs]
Once you are logged in successfully, please click the authorize button

🎯 **Now your Star Wars API is ready to run!** 🚀
