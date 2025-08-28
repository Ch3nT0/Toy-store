const mongoose = require("mongoose");

const aboutUsSchema = new mongoose.Schema(
  {
    tenCongty: String,
    sdt: String,
    diachi: String,
    email: String,
    facebook: String ,
    instagram:  String ,
    tiktok: String ,
    thumb: { type: [String], default: [] } 
  },
  {
    timestamps: true 
  }
);

const AboutUs = mongoose.model("AboutUs", aboutUsSchema, "aboutUs");

module.exports = AboutUs;
