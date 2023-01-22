# Sport Equipment Inventory

Inventory management app for an imaginary sport equipment store.

## Features

The app has Categories, Equipments, Inventory and Locations.
The app allows you to use CRUD operations on all of them.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You will need to have Node.js and npm (Node Package Manager) installed on your machine. You can download and install them from the official website (https://nodejs.org/en/).

### Installing

1. Clone the repository to your local machine

```sh
git clone https://github.com/IlyaEru/Sport-Equipment-Inventory.git
```

2. Install NPM packages

```sh
npm install
```

3. Create a .env file in the root directory of the project and add the following environment variables:

MONGO_DB_ATLAS_URI - MongoDB Atlas connection string
OR MONGO_DB_LOCAL_URI - MongoDB local connection string (if you want to use local MongoDB instance, BUT you need to have MongoDB installed on your machine and running, Also you need to change the name where MONGO_DB_ATLAS_URI is used)

4.  Populate the database with some data

```sh
npm run populate
```

5. Run the app

```sh
npm start
```

The application will now be running on http://localhost:3000.

## Built With

- TypeScript - Typed superset of JavaScript
- Express - Web framework for Node.js
- EJS - Embedded JavaScript templating
- MongoDB - NoSQL database
- Mongoose - MongoDB object modeling tool
- Sass - CSS preprocessor
- Jest - JavaScript testing framework
- Mongodb-memory-server - MongoDB in-memory server for testing
