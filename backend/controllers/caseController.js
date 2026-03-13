const Case = require('../models/Case');
const generateTrackingId = require('../utils/generateTrackingId');

const createCase = async (req, res) => {
  try {
    const { category, department, location, severity, description, anonymous } = req.body;
    const trackingId = await generateTrackingId();
    const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const newCase = await Case.create({
      trackingId,
      category,
      department,
      location,
      severity,
      description,
      anonymous: anonymous === 'true' || anonymous === true,
      submittedBy: anonymous ? null : req.user._id,
      fileUrl
    });

    res.status(201).json(newCase);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCases = async (req, res) => {
  try {
    const { role, _id } = req.user;
    let query = {};

    if (role === 'case_manager') {
      query = { assignedTo: _id };
    } else if (role === 'staff') {
      query = { submittedBy: _id };
    }

    const cases = await Case.find(query)
      .populate('assignedTo', 'name email')
      .populate('submittedBy', 'name email')
      .populate('notes.addedBy', 'name')
      .sort({ createdAt: -1 });

    res.json(cases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCaseById = async (req, res) => {
  try {
    const c = await Case.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('submittedBy', 'name email')
      .populate('notes.addedBy', 'name');
    if (!c) return res.status(404).json({ message: 'Case not found' });
    res.json(c);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCase = async (req, res) => {
  try {
    const c = await Case.findById(req.params.id);
    if (!c) return res.status(404).json({ message: 'Case not found' });

    const { status, note, actionTaken, result } = req.body;
    if (status) c.status = status;
    if (actionTaken !== undefined) c.actionTaken = actionTaken;
    if (result !== undefined) c.result = result;
    if (note) {
      c.notes.push({ text: note, addedBy: req.user._id });
    }

    await c.save();
    res.json(c);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCase = async (req, res) => {
  try {
    await Case.findByIdAndDelete(req.params.id);
    res.json({ message: 'Case deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const assignCase = async (req, res) => {
  try {
    const c = await Case.findById(req.params.id);
    if (!c) return res.status(404).json({ message: 'Case not found' });

    c.assignedTo = req.body.assignedTo;
    c.status = 'Assigned';
    await c.save();

    const populated = await c.populate('assignedTo', 'name email');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createCase, getCases, getCaseById, updateCase, deleteCase, assignCase };
