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

