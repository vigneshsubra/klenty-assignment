const express = require('express');

const discussionListController = require('../controllers/discussion-list-controller');

const router = express.Router();

router.get('/', discussionListController.getAllDiscussions);

router.post('/', discussionListController.createDiscussion);


module.exports = router