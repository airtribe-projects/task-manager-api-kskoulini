const express = require('express');
const router = express.Router();
const { getAllTasks,
        getTaskById,
        getTaskByPriority,
        insertNewTask,
        updateTaskById,
        deleteTaskById  } = require('../controllers/taskControllers');
const { taskIdValidator,
        taskLevelValidator,
        taskBodyValidators, 
        handleValidationErrors } = require('../middlewares/taskMiddlewares');

router.get('/', getAllTasks);
router.get('/priority/:level?', taskLevelValidator, handleValidationErrors, getTaskByPriority);
router.get('/:id', taskIdValidator, handleValidationErrors, getTaskById);
router.post('/', taskBodyValidators, handleValidationErrors, insertNewTask);
router.put('/:id', [...taskIdValidator, ...taskBodyValidators], handleValidationErrors, updateTaskById);
router.delete('/:id', taskIdValidator, handleValidationErrors, deleteTaskById);

module.exports = router;