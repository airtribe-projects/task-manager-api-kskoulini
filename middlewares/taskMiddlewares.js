const { body, param, validationResult } = require('express-validator');

// Middleware to validate task data
const taskIdValidator = [
    param('id')
        .isInt({ min: 1 }).withMessage('id must be a positive integer')
        .toInt(),
];

const taskLevelValidator = [
    param('level')
        .optional()
        .isIn(['low', 'medium', 'high']).withMessage('level must be one of low|medium|high')
]

const taskBodyValidators = [
    body('title').notEmpty().withMessage('title is required'),
    body('description').notEmpty().withMessage('description is required'),
    body('completed')
        .exists().withMessage('completed is required')
        .custom(value => typeof value === 'boolean').withMessage('completed must be a boolean'),
    body('priority') 
        .optional()
        .toLowerCase()
        .isIn(['low', 'medium', 'high']).withMessage('level must be one of low|medium|high')
];

// Function to handle task validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorList = errors.array();

    // Check if any parameter errors
    const hasParamError = errorList.some(err => err.location === "params");
    const hasBodyError = errorList.some(err => err.location === "body");

    if (hasParamError) {
        // Use 404 Not Found for parameter errors
        return res.status(404).json({ errors: errorList.filter(e => e.location === "params") });
    }
    if (hasBodyError) {
        // Use 400 Bad Request for body errors
        return res.status(400).json({ errors: errorList.filter(e => e.location === "body") });
    }

    // Default fallback
    return res.status(400).json({ errors: errorList });
  }

  next();
};

module.exports = {
    taskIdValidator,
    taskLevelValidator,
    taskBodyValidators,
    handleValidationErrors,
};