var router = require('express').Router();
var userController = require('./controllers/userController');
var backlogController = require('./controllers/backlogController');

//Connect controller methods to their corresponding routes
router.get('/api/users', userController.get);
router.post('/api/users', userController.post);

router.get('/api/backlogs', backlogController.allBacklogs);
router.post('/api/backlogs', backlogController.newBacklog);
router.put('/api/backlogs', backlogController.updateBacklog);

module.exports = router;
