const AboutUs = require("../../models/aboutUs.model");

// [GET] /aboutUs
exports.getAboutUs = async (req, res) => {
  try {
    const aboutUs = await AboutUs.findOne(); 
    res.json({
      code: 200,
      data: aboutUs,
    });
  } catch (err) {
    res.status(500).json({
      code: 500,
      message: "Error",
      error: err.message,
    });
  }
};

// [PATCH] /aboutUs
exports.updateAboutUs = async (req, res) => {
  const updateData = req.body;

  try {
    const updated = await AboutUs.findOneAndUpdate({}, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      const created = await AboutUs.create(updateData);
      return res.json({
        code: 201,
        message: "Created AboutUs",
        data: created,
      });
    }

    res.json({
      code: 200,
      message: "Updated successfully",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({
      code: 500,
      message: "Error updating AboutUs",
      error: err.message,
    });
  }
};
