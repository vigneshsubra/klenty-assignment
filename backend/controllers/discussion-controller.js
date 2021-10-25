const HttpError = require('../models/http-errors');

const Discussion = require('../models/discussion');
const { json } = require('body-parser');

const getDiscussionById = async (req, res, next) => {

  const discussionId = req.params.disId;

  let discussion;

  try {
    discussion = await Discussion.findById(discussionId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find the discussion', 500
    );
    return next(error);
  }


  if (!discussion) {
    return next(new HttpError('Could not find a discussion with the given id.', 404));
  }
  const discussionStr = JSON.parse(JSON.stringify(discussion));
  res.json({ discussion: discussionStr });
};

const addReply = async (req, res, next) => {
  const { username, reply } = req.body;

  const discussionId = req.params.disId;

  let discussion;
  try {
    discussion = await Discussion.findById(discussionId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not add update.', 500
    );
    return next(error);
  }

  const newReply = {
    username,
    reply
  };

  discussion.replies.unshift(newReply);

  try {
    await discussion.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not add reply.', 500
    );
    return next(error);
  }

  res.status(201).json({ reply: newReply });
}

exports.getDiscussionById = getDiscussionById;
exports.addReply = addReply;