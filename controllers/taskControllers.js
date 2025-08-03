const fs = require('fs');
const { type } = require('os');
const path = require('path');

// Load the data from the JSON file
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
// const cleanTaskId = (taskId) => {
//     const cleanedTaskId = taskId ? Number(taskId) : null;
//     return cleanedTaskId;
// }

// const isValidTask = (taskObj) => {
//     return taskObj && 
//             typeof taskObj === 'object' &&
//             typeof taskObj.title === 'string' &&
//             typeof taskObj.description === 'string' &&
//             typeof taskObj.completed === 'boolean';
// }

const sortTasksByCreatedDate = (tasks) => {
    return tasks.sort((a, b) => {
        if (a.created && b.created) {
            return new Date(a.created) - new Date(b.created);
        }
        if (a.created) return 1;
        if (b.created) return -1;
        return 0;
    });
}

const sortTasksByPriority = (tasks) => {
    const priorityOrder = {
        'low': 1,
        'medium': 2,
        'high': 3
    };

    return tasks.sort((a, b) => {
        if (a.priority && b.priority) {
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        }

        if (a.priority) return 1;
        if (b.priority) return -1;
    });
}

// GET request handler to return all tasks
// Optionally filter tasks by completed status
const getAllTasks = (req, res) => {

    const completedFilter = req.query.completed !== undefined ? Boolean(req.query.completed) : null;

    // Return all tasks
    if (taskData.length === 0) {
        return res.status(404).send('No tasks found');
    }

    // Filter tasks based on completed status
    if(typeof completedFilter === 'boolean') {
        const filteredTasks = taskData.filter(task => task.completed === completedFilter);
        return res.status(200).send(filteredTasks);
    }

    // If no filter is applied, return all tasks
    res.status(200).send(sortTasksByCreatedDate(taskData));
}

// GET request handler to get a task by id
const getTaskById = (req, res) => {
    const taskId = Number(req.params.id);

    // If the task id is provided, find the task
    const taskFound = taskData.find((task) => task.id === taskId);
    let resStatus = taskFound ? 200 : 404;
    let resBody = taskFound ? taskFound : 'Invalid Input: Task not found';
    res.status(resStatus).send(resBody);
}

// Get request handler to get a task by priority level
// Optionally filter tasks by priority level
const getTaskByPriority = (req, res) => {
    const level = req.params.level;
    let resTasks = taskData;

    // If the level is provided, filter tasks by priority level
    if (level) {
        resTasks = taskData.filter(task => task.priority === level);
    }

    resTasks = sortTasksByPriority(resTasks);
    resStatus = resTasks.length > 0 ? 200 : 404;
    resBody = resTasks.length > 0 ? resTasks : 'No tasks found for the specified priority level';
    res.status(resStatus).send(resBody);
}


// POST request handler to create a new task
const insertNewTask = (req, res) => {
    const newTask = req.body;

    // Create a new task id
    const newTaskId = taskData.length > 0 ? (Number(taskData[taskData.length - 1].id) || 0) + 1 : 1;

    // Add the new task to the task data
    const taskToInsert = {
        ...newTask,
        "created": new Date().toISOString(),
        id: newTaskId
    };
    taskData.push(taskToInsert);

    let resStatus = 201;
    let resBody = `Success: Task ${newTaskId} created`;
    res.status(resStatus).send(resBody);
}

// PUT request handler to update a task by id
const updateTaskById = (req, res) => {
    const taskId = Number(req.params.id);
    const updatedTask = req.body;

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
    const taskId = Number(req.params.id);

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
    getTaskByPriority,
    insertNewTask,
    updateTaskById,
    deleteTaskById
}