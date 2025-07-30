# Node.js API AnimalRegistrationAPI

This AnimalRegistrationAPI offers a comprehensive and robust foundation for building a Node.js-powered API. It integrates a suite of essential tools and libraries to streamline backend development, ensuring efficiency, scalability, and maintainability.

## Key Features

- **Database**: PostgreSQL for reliable and scalable data storage.
- **Web Framework**: Express.js for building robust and flexible APIs.
- **API Documentation**: Swagger with Swagger UI for interactive API documentation.
- **Logging**: Built-in API logging for monitoring and debugging.
- **Middleware**: Custom middleware for request processing, authentication, and error handling.
- **Code Quality**:
  - ESLint for code linting and maintaining coding standards.
  - Prettier for consistent code formatting.
- **Version Control**:
  - Husky for Git hooks to enforce code quality checks before commits.
- **ORM**: Prisma for type-safe database access and migrations.

## Features

- **PostgreSQL**: A powerful, open-source relational database system.
- **Express**: A minimal and flexible Node.js web application framework.
- **Swagger**: Tools for designing and documenting RESTful APIs.
- **Swagger UI**: Interactive API documentation.
- **Husky**: Improves Git hooks for pre-commit and pre-push tasks.
- **Prettier**: Code formatter to ensure consistent code style.
- **ESLint**: Pluggable JavaScript linter for identifying and fixing code issues.
- **Prisma**: Next-generation ORM for Node.js and TypeScript.
- **Logging**: API logging for request tracking and debugging.
- **Middleware**: Pre-configured middleware for common use cases.

## Prerequisites

1. Database: Create a new PostgreSQL database:

        CREATE DATABASE AnimalRegistrationAPI;

2. Environment Variables: Configure the .env file with your settings (refer to the Basic Settings section).

# Installation

1. Clone the Repository:

        git clone https://github.com/Thavisoukmnlv9/AnimalRegistrationAPI-NodeJS-Express.git
        cd AnimalRegistrationAPI

2. Install Dependencies:

        npm install

# Basic Settings

Create a .env file in the root of your project with the following content:

    ##Application Settings

    NODE_ENV=development
    SERVICE_NAME=AnimalRegistrationAPI
    HOST=0.0.0.0
    NODE_PORT=3000
    TZ=Asia/Bangkok

    ## Database Configuration

    DATABASE_URL="postgresql://<username>:<password>@<host>:5432/<database>?schema=<db_name>&timezone=UTC"

    ## JWT Configuration

    JWT_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n<your-private-key>\n-----END RSA PRIVATE KEY-----"
    JWT_REFRESH_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n<your-refresh-private-key>\n-----END PRIVATE KEY-----"
    JWT_REFRESH_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\n<your-public-key>\n-----END PUBLIC KEY-----"

# Usage

## Available Scripts

In the project directory, you can run the following scripts:

Development

- Starts the development server with nodemon, enabling automatic restarts on file changes.

        npm run dev

- Executes both db:pull and db:generate commands.

        npm run db:pull

- Pulls the current database schema.
- Command:

        prisma db pull
        npm run db:generate

- Generates Prisma client code.
- Command: prisma generate

        npm run db:migrate

## Setup

        npm run setup:env

Copies .env.example to .env.
Command: cp .env.example .env



## Docker Setup

If you want to run the application using Docker, follow these steps:

### Build for x86 Architecture

1. **Build the Docker image using the `Dockerfile.x86_64`:**

    ```bash
    docker build -f Dockerfile.x86_64 --no-cache -t animal-registration-api .
    ```

    Replace `animal-registration-api` with a name you want for your Docker image.

2. **Run the Docker container:**

    ```bash
    docker run -p 8000:8000 animal-registration-api
    ```

    This will run the application on `http://127.0.1:8000/`.

---

### Build for ARM Architecture

1. **Build the Docker image using the `Dockerfile.arm`:**

    ```bash
    docker buildx build -f Dockerfile.arm  --no-cache --platform=linux/amd64 -t repo/"version" --push .

    ```

    Replace `animal-registration-api` with a name you want for your Docker image.

2. **Run the Docker container:**

    ```bash
    docker run -d -p 8000:8000 --name animal-registration-api --env-file .env animal-registration-api
    ```

    This will run the application on `http://127.0.1:8000/`.
