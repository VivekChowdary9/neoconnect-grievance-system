const Case = require("../models/Case");

exports.createCase = async (req, res) => {
  try {
    const newCase = await Case.create({
      ...req.body,
      createdBy: req.user.id,
    });

    res.json(newCase);
  } catch (err) {
    res.status(500).json({ message: "Error creating case" });
  }
};

exports.getCases = async (req, res) => {
  try {
    const cases = await Case.find().populate("createdBy", "name");

    res.json(cases);
  } catch (err) {
    res.status(500).json({ message: "Error fetching cases" });
  }
};