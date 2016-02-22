var router = require('express').Router();
var userController = require('./controllers/userController');
var backlogController = require('./controllers/backlogController');
var applicationController = require('./controllers/applicationController');

//Connect controller methods to their corresponding routes
router.get('/api/users', userController.get);
router.post('/api/users', userController.post);
router.post('/api/application', applicationController.createApp);

router.get('/api/backlogs', backlogController.allBacklogs);
router.get('/api/pendingBacklogs', backlogController.pendingBacklogs);
router.post('/api/backlogs', backlogController.newBacklog);
router.put('/api/backlogs', backlogController.updateBacklog);

module.exports = router;
