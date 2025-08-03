const express = require('express');
const router = express.Router();
const { getAllTasks,
        getTaskById,
        insertNewTask,
        updateTaskById,
        deleteTaskById  } = require('../controllers/taskControllers');
const { taskIdValidator, taskBodyValidators, handleValidationErrors } = require('../middlewares/taskMiddlewares');

router.get('/', getAllTasks);
router.get('/:taskId', taskIdValidator, handleValidationErrors, getTaskById);
router.post('/', taskBodyValidators, handleValidationErrors, insertNewTask);
router.put('/:taskId', [...taskIdValidator, ...taskBodyValidators], handleValidationErrors, updateTaskById);
router.delete('/:taskId', taskIdValidator, handleValidationErrors, deleteTaskById);

module.exports = router;