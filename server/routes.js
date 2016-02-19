var router = require('express').Router();
var userController = require('./controllers/userController');

//Connect controller methods to their corresponding routes
router.get('api/users', userController.get);
router.post('api/users', userController.post);

module.exports = router;
