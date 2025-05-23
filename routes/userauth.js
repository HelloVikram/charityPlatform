const express = require('express');
const router = express.Router();
const userController = require('../controllers/userauth');
const authMiddleware=require('../middleware/authMiddleware');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.put('/profile', authMiddleware.authenticate, userController.updateProfile);
module.exports = router;
