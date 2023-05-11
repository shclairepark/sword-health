# Task Management API

The Task Management API is a software application that allows users to account for maintenance tasks performed during a working day. It provides endpoints for creating, updating, listing, and deleting tasks. The API uses Express.js as the web framework and MySQL as the database for storing task information. It also utilizes Nodemailer to send email notifications.

## User Roles and Permissions

1. Manager: Managers have access to all tasks performed by technicians. They can view tasks, delete tasks, and receive notifications when a technician performs a task.
2. Technician: Technicians can only see, create, and update their own performed tasks. They have limited access to tasks and cannot view or modify tasks performed by other technicians.

## API Endpoints

### Create a New Task

- URL: `/api/tasks`
- Method: `POST`
- Request Body: `{ summary, performedAt, technicianId }`
- Response Body: `{ id }`
- Description: Saves a new task to the database and sends an email notification to the manager.

### Update a Task

- URL: `/api/tasks/:taskId`
- Method: `PUT`
- Request Body: `{ summary, performedAt, technicianId }`
- Description: Updates an existing task in the database.

### List Tasks

- URL: `/api/tasks`
- Method: `GET`
- Query Parameters: `{ userId }`
- Response Body: `[tasks]`
- Description: Retrieves a list of tasks based on the user's role. Technicians can only see tasks they created, while managers and admins can see all tasks.

### Delete a Task

- URL: `/api/tasks/:taskId`
- Method: `DELETE`
- Query Parameters: `{ userId }`
- Description: Deletes a task from the database. Only managers can access this endpoint.

## Local Dev

1. Install Dependencies

```
npm install
```

2. Set up the MySQL database and update .env file

.env should have following variables

```
MYSQLDB_USER=root
MYSQLDB_ROOT_PASSWORD=
MYSQLDB_DATABASE=sword_db
MYSQLDB_LOCAL_PORT=3307
MYSQLDB_DOCKER_PORT=3306

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=sword_db
DB_PORT=3306

APP_PORT=3000
```

3. Set up the email configuration in `tasks.js` by providing your Gmail account credentials to send the notification

4. Start the server

```
npm start
```

## Run the app on Docker

```
docker-compose up
```

This will first create the docker images for mysql, tasks app and then run both the containers.

\*\* For testing purpose, five users are initially set.
userId 3, 4, 5 have technician role and userId 2 has manager role.

To tear down the images,

```
docker-compose down --rmi all
```

## Hit Endpoints

Please refer [postman collection](sword-tasks.postman_collection.json) to hit the endpoints
