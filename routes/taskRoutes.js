const express = require('express');
const router = express.Router();
const { getAllTasks,
        getTaskById,
        insertNewTask,
        updateTaskById,
        deleteTaskById  } = require('../controllers/taskControllers');

router.get('/', getAllTasks);
router.get('/:taskId', getTaskById);
router.post('/', insertNewTask);
router.put('/:taskId', updateTaskById);
router.delete('/:taskId', deleteTaskById);

module.exports = router;