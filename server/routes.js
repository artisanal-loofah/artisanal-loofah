var router = require('express').Router();
var helpers = require('./config/helpers');
var userController = require('./controllers/userController');
var applicationController = require('./controllers/applicationController')
var backlogController = require('./controllers/backlogController');
var appSubmitController = require('./controllers/appsubmitController');
var phoneScreenController = require('./controllers/phoneScreenController');
var onSiteController = require('./controllers/onSiteController');
var applicationController = require('./controllers/applicationController');
var offerController = require('./controllers/offerController');

//Connect controller methods to their corresponding routes
router.get('/api/users', userController.get);
router.post('/api/users', userController.post);

router.use('/api/applications', helpers.decode);
router.get('/api/applications', applicationController.getAll);
router.post('/api/applications', applicationController.create);

router.use('/api/backlogs', helpers.decode);
router.get('/api/backlogs', backlogController.allBacklogs);
router.post('/api/backlogs', backlogController.addBacklog);
router.put('/api/backlogs', backlogController.updateBacklog);

// List Item controllers
// Note: GET requests return ALL list items

router.use('/api/appsubmits', helpers.decode);
router.get('/api/appsubmits', appSubmitController.allAppSubmits);
router.post('/api/appsubmits', appSubmitController.addAppSubmit);
router.put('/api/appsubmits', appSubmitController.updateAppSubmit);

router.use('/api/phonescreens', helpers.decode);
router.get('/api/phonescreens', phoneScreenController.allPhoneScreens);
router.post('/api/phonescreens', phoneScreenController.addPhoneScreen);
router.put('/api/phonescreens', phoneScreenController.updatePhoneScreen);

router.use('/api/onsites', helpers.decode);
router.get('/api/onsites', onSiteController.allOnSites);
router.post('/api/onsites', onSiteController.addOnSite);
router.put('/api/onsites', onSiteController.updateOnSite);

router.use('/api/offers', helpers.decode);
router.get('/api/offers', offerController.allOffers);
router.post('/api/offers', offerController.addOffer);
router.put('/api/offers', offerController.updateOffer);

module.exports = router;
