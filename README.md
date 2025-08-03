Task Management API
====================
- This project houses a RESTful API for managing tasks using Node.js, Express.js, and in-memory data storage.
- It implements CRUD operations, error handling, and input validation.

## Features
- Controllers and Routes handling `Create`, `Read`, `Update`, and `Delete` tasks
- In-memory data storage for tasks. Reads the data from `task.json` file.
- Input validation using `express-validator`
- Error handling middleware for common scenarios

## Installation
1. Clone the repository: `git clone https://github.com/airtribe-projects/task-manager-api-kskoulini.git`
2. Navigate to the project directory: `cd task-manager-api-kskoulini`
3. Install dependencies: `npm install`
4. Start the server: `npm start`

## Routes
- `GET /tasks`: Retrieve all tasks. Sorts tasks by `creation` date by default.
- `GET /tasks/priority/:level?`: Retrieve tasks sorted by `priority` level (optional filter by level).
- `GET /tasks/:id`: Retrieve a task by ID.
- `POST /tasks`: Create a new task.
- `PUT /tasks/:id`: Update a task by ID.
- `DELETE /tasks/:id`: Delete a task by ID.

## Error Handling
- Checks if the task ID is a positive integer, returning a 404 status code for invalid IDs.
- Validates task body fields, returning a 400 status code for missing or invalid fields.
- Returns a 404 status code if a task is not found during retrieval or deletion.

Thank you! :)



