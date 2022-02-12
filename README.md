# TypeScript REST API
This is sample of TypeScript REST API with JWT Authentication.

## Technologies Backend
* Node.js - JS Runtime Environment
* TypeScript - Static Typing JS
* ExpressJS - web framework for Node.js
* MongoDB and Mongoose - noSQL Database and library that creates a connection between MongoDB and the Express.
* Zod - schema validation
* Jest - JS testing framework maintained  by Facebook
* Supertest - library for testing http
* Google oAuth2 - Google SSO with oAuth2 protocol
## Technologies Frontend
* Next.js - enables React application Server Side Rendering functionalities, which put big emphasize on website performance
* Axios - promised based http client 
* Zod - schema and form validation
* react-hook-form - react library for creating flexible form validation
* SWR - react library for data fetching. SWR is a strategy to first return data from cache, then send the fetch request,
and finally come with up-to-date data. With SWR, components will get a stream of data updates constantly and automatically.
And the UI will be always fast and reactive.

## Prerequisites
1. Running instance of docker(preferably Docker)
```docker
docker run --name mongodb -p 27017:27017 -d mongo
```
2. Package manager such as NPM or Yarn

3. NodeJS version 14 and higher 
## Used Concepts
* REST API principals (CRUD and HTTP methods)
* JWT & refresh tokens
* Request validation by using middleware
* Testing API(Middleware, Controller, Service) with Supertest and Mongodb-memory-server
* Storing authentication credentials inside cookies instead local storage.
## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.


