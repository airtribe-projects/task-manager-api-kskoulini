const fs = require('fs');
const path = require('path');

// Load Data
const taskFileName = 'task.json';
const taskFilePath = path.join(__dirname,`..`,`${taskFileName}`);

let taskString = null;
try{
    taskString = fs.readFileSync(taskFilePath,'utf-8');
}
catch(e){
    console.log(`Error reading file: ${taskFileName}`);
    console.error(e);
}

const taskJSON = taskString ? JSON.parse(taskString) : {};
const taskData = taskJSON.tasks || [];

// Helper functions
const cleanTaskId = (taskId) => {
    const cleanedTaskId = taskId ? Number(taskId) : null;
    return cleanedTaskId;
}

const isValidTask = (taskObj) => {
    return taskObj && 
            typeof taskObj === 'object' &&
            typeof taskObj.title === 'string' &&
            typeof taskObj.description === 'string' &&
            typeof taskObj.completed === 'boolean';
}

// GET request handler to return all tasks
const getAllTasks = (req, res) => {
    // Return all tasks
    if (taskData.length === 0) {
        return res.status(404).send('No tasks found');
    }
    res.status(200).send(taskData);
}

// GET request handler to get a task by id
const getTaskById = (req, res) => {
    const taskId = cleanTaskId(req.params.taskId);
    
    // Check if taskId is valid
    if(!taskId){
        res.status(404).send('Invalid Input: Check the task id provided');
    }

    // If the task id is provided, find the task
    const taskFound = taskData.find((task) => task.id === taskId);
    let resStatus = taskFound ? 200 : 404;
    let resBody = taskFound ? taskFound : 'Invalid Input: Task not found';
    res.status(resStatus).send(resBody);
}

// POST request handler to create a new task
const insertNewTask = (req, res) => {
    const newTask = req.body;
    
    // Check if the task body is valid
    if(!isValidTask(newTask)) {
        let resStatus = 400;
        let resBody = 'Invalid Input: Check the task data provided';
        return res.status(resStatus).send(resBody);
    }

    // Create a new task id
    const newTaskId = taskData.length > 0 ? (Number(taskData[taskData.length - 1].id) || 0) + 1 : 1;

    // Add the new task to the task data
    const taskToInsert = {
        ...newTask,
        id: newTaskId
    };
    taskData.push(taskToInsert);

    let resStatus = 201;
    let resBody = `Success: Task ${newTaskId} created`;
    res.status(resStatus).send(resBody);
}

// PUT request handler to update a task by id
const updateTaskById = (req, res) => {
    const taskId = cleanTaskId(req.params.taskId);
    const updatedTask = req.body;

    // Check if taskId is valid
    if (!taskId) {
        let resStatus = 404;
        let resBody = 'Invalid Input: Check the task id provided';
        return res.status(resStatus).send(resBody);
    }

    // Checking if the task body is valid
    if(!isValidTask(updatedTask)) {
        let resStatus = 400;
        let resBody = 'Invalid Input: Check the task data provided';
        return res.status(resStatus).send(resBody);
    }

    // Checking if the task exists
    const taskIndex = taskData.findIndex((task) => task.id === taskId);
    if (taskIndex === -1) {
        let resStatus = 404;
        let resBody = 'Invalid Input: Task not found';
        return res.status(resStatus).send(resBody);
    }

    // Update the task
    taskData[taskIndex] = {
        ...taskData[taskIndex],
        ...updatedTask,
        id: taskId
    }

    let resStatus = 200;
    let resBody = `Successs: Task ${taskId} updated`;
    res.status(resStatus).send(resBody);
}

// DELETE request handler to delete a task by id
const deleteTaskById = (req, res) => {
    const taskId = cleanTaskId(req.params.taskId);

    // Check if taskId is valid
    if (!taskId) {
        let resStatus = 404;
        let resBody = 'Invalid Input: Check the task id provided';
        return res.status(resStatus).send(resBody);
    }

    // Checking if the task exists
    const taskIndex = taskData.findIndex((task) => task.id === taskId);
    if (taskIndex === -1) {
        let resStatus = 404;
        let resBody = 'Invalid Input: Task not found';
        return res.status(resStatus).send(resBody);
    }

    // Delete the task
    taskData.splice(taskIndex, 1);
    let resStatus = 200;
    let resBody = `Success: Task ${taskId} deleted`;
    res.status(resStatus).send(resBody);
}

module.exports = {
    getAllTasks,
    getTaskById,
    insertNewTask,
    updateTaskById,
    deleteTaskById
}