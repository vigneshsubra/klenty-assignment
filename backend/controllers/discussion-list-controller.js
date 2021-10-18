const Discussion = require('../models/discussion');

const HttpError = require('../models/http-errors')

const getAllDiscussions = async (req, res, next) => {

  let discussions;

  try {
    discussions = await Discussion.find();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong. Could not fetch discussions', 500
    );
    return next(error);
  }

  res.json({ discussions: discussions.map(discussion => discussion.toObject({ getters: true })) });
};

const createDiscussion = async (req, res, next) => {
  const { replies, topic, description } = req.body;

  const createdDiscussion = new Discussion({
    topic,
    description,
    replies
  });

  try {
    await createdDiscussion.save();
  } catch (err) {
    const error = new HttpError(
      'Creating discussion failed.',
      500
    );
    return next(error);
  }

  res.status(201).json({ discussion: createdDiscussion });
}

exports.getAllDiscussions = getAllDiscussions;

exports.createDiscussion = createDiscussion;