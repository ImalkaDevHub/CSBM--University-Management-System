const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.loginUser);
router.post('/google', authController.googleLogin);
router.get('/create-admin', authController.createAdminUser);
router.post('/register', authController.registerUser);
router.get('/debug-users', authController.debugUsers);

module.exports = router;
