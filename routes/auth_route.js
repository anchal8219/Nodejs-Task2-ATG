const express =  require('express')
const router = express.Router();
const authController = require('../controller/auth')

router.post('/signup',authController.register);
router.post('/login',authController.login);
router.post('/forget-password',authController.forgetPassword);
router.get('/reset-password',authController.resetPassword);
router.get('/allusers',authController.getAllUsers);

module.exports = router;