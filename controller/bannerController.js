const BannerImage = require("../model/bannerImage");
const path = require("path");
const fs = require("fs");

exports.createBannerImage = async (req, res) => {
  try {
    const { altText, bannerText } = req.body;
    const imageFile = req.files.image ? req.files.image[0] : null;
    const mobileImageFile = req.files.mobileImage ? req.files.mobileImage[0] : null;
    const tabImageFile = req.files.tabImage ? req.files.tabImage[0] : null;

    if (!imageFile || !mobileImageFile || !tabImageFile) {
      return res.status(400).json({ message: "All images (main, mobile, and tab) must be uploaded." });
    }

    const imageUrl = `/uploads/banner-image/${imageFile.filename}`;
    const mobileImageUrl = `/uploads/banner-image/${mobileImageFile.filename}`;
    const tabImageUrl = `/uploads/banner-image/${tabImageFile.filename}`;

    const newBannerImage = new BannerImage({
      imageUrl,
      mobileImageUrl,
      tabImageUrl,
      altText,
      bannerText
    });

    await newBannerImage.save();

    res.status(201).json({
      message: "Banner image created successfully.",
      data: newBannerImage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};


exports.getAllBannerImages = async (req, res) => {
  try {
    const bannerImages = await BannerImage.find();
    res.status(200).json(bannerImages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};

exports.getBannerImageById = async (req, res) => {
  try {
    const bannerImage = await BannerImage.findById(req.params.id);
    if (!bannerImage) {
      return res.status(404).json({ message: "Banner image not found." });
    }
    res.status(200).json(bannerImage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};
exports.updateBannerImage = async (req, res) => {
  try {
    const { altText, bannerText } = req.body;
    const bannerImage = await BannerImage.findById(req.params.id);

    if (!bannerImage) {
      return res.status(404).json({ message: "Banner image not found." });
    }

    if (req.files && req.files.image) {
      const oldImagePath = path.resolve(process.cwd(), 'uploads/banner-image', path.basename(bannerImage.imageUrl));
      
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      } else {
        console.warn('Old image file not found at path:', oldImagePath);
      }
      
      bannerImage.imageUrl = `/uploads/banner-image/${req.files.image[0].filename}`;
    }

    // Handling mobile image update
    if (req.files && req.files.mobileImage) {
      const oldMobileImagePath = path.resolve(process.cwd(), 'uploads/banner-image', path.basename(bannerImage.mobileImageUrl));
      
      if (fs.existsSync(oldMobileImagePath)) {
        fs.unlinkSync(oldMobileImagePath);
      } else {
        console.warn('Old mobile image file not found at path:', oldMobileImagePath);
      }
      
      bannerImage.mobileImageUrl = `/uploads/banner-image/${req.files.mobileImage[0].filename}`;
    }

    if (req.files && req.files.tabImage) {
      const oldTabImagePath = path.resolve(process.cwd(), 'uploads/banner-image', path.basename(bannerImage.tabImageUrl));
      
      if (fs.existsSync(oldTabImagePath)) {
        fs.unlinkSync(oldTabImagePath);
      } else {
        console.warn('Old tab image file not found at path:', oldTabImagePath);
      }
      
      bannerImage.tabImageUrl = `/uploads/banner-image/${req.files.tabImage[0].filename}`;
    }

    bannerImage.altText = altText || bannerImage.altText;
    bannerImage.bannerText = bannerText || bannerImage.bannerText;

    await bannerImage.save();

    res.status(200).json({
      message: "Banner image updated successfully.",
      data: bannerImage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};
  

exports.deleteBannerImage = async (req, res) => {
  try {
    const bannerImage = await BannerImage.findById(req.params.id);

    if (!bannerImage) {
      return res.status(404).json({ message: "Banner image not found." });
    }

    const imagePath = path.resolve(process.cwd(), 'uploads/banner-image', path.basename(bannerImage.imageUrl));
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath); 
      console.log('Image deleted from filesystem.');
    } else {
      console.warn('Image file not found at path:', imagePath);
    }

    await BannerImage.deleteOne({ _id: req.params.id });

    res.status(200).json({ message: "Banner image deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};
