const Poll = require('../models/Poll');

const createPoll = async (req, res) => {
  try {
    const { question, options } = req.body;
    const poll = await Poll.create({
      question,
      options: options.map((text) => ({ text })),
      createdBy: req.user._id
    });
    res.status(201).json(poll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPolls = async (req, res) => {
  try {
    const polls = await Poll.find()
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });
    res.json(polls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const votePoll = async (req, res) => {
  try {
    const { pollId, optionIndex } = req.body;
    const poll = await Poll.findById(pollId);
    if (!poll) return res.status(404).json({ message: 'Poll not found' });

    if (poll.voters.includes(req.user._id)) {
      return res.status(400).json({ message: 'You have already voted' });
    }

    poll.options[optionIndex].votes += 1;
    poll.voters.push(req.user._id);
    await poll.save();
    res.json(poll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createPoll, getPolls, votePoll };
