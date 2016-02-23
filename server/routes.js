var router = require('express').Router();
var userController = require('./controllers/userController');
var applicationController = require('./controllers/applicationController')
var backlogController = require('./controllers/backlogController');
var appSubmitController = require('./controllers/appsubmitController');
var onSiteController = require('./controllers/onSiteController');
var applicationController = require('./controllers/applicationController');

//Connect controller methods to their corresponding routes
router.get('/api/users', userController.get);
router.post('/api/users', userController.post);

router.get('/api/applications', applicationController.getAll);
router.post('/api/applications', applicationController.create);

router.get('/api/backlogs', backlogController.allBacklogs);
router.post('/api/backlogs', backlogController.newBacklog);
router.put('/api/backlogs', backlogController.updateBacklog);

// List Item controllers
// Note: GET requests return ALL list items

router.get('/api/appsubmits', appSubmitController.getAllApps);
router.post('/api/appsubmits', appSubmitController.addApp);
router.put('/api/appsubmits', appSubmitController.editApp);

router.get('/api/onsites', onSiteController.getAllOnSites);
router.post('/api/onsites', onSiteController.addOnSite);
router.put('/api/onsites', onSiteController.editOnSite);

module.exports = router;
