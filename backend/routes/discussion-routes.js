const express = require('express');

const discussionController = require('../controllers/discussion-controller');

const router = express.Router();

router.get('/:disId', discussionController.getDiscussionById);

router.post('/:disId/add-reply', discussionController.addReply);

module.exports = router