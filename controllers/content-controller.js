exports.getContent = async (req, res) => {
  try {
    // For now, return static content while DB integration is pending
    const { lang = "en" } = req.query;

    const staticContent = {
      common: {
        contactUs: {
          en: "Contact Us",
          ar: "اتصل بنا",
        },
        aboutUs: {
          en: "About Us",
          ar: "من نحن",
        },
        submit: {
          en: "Submit",
          ar: "إرسال",
        },
      },
    };

    res.json(staticContent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addContent = async (req, res) => {
  try {
    // This will be implemented when DB integration is ready
    res.status(501).json({ message: "Not implemented yet" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
