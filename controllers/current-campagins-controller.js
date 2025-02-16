// ...existing imports...

const createCurrentCampaign = async (req, res) => {
  try {
    // Parse details from form data
    let details = null;
    try {
      details = JSON.parse(req.body.details);
    } catch (error) {
      return res.status(400).json({ message: "Invalid details format" });
    }

    const campaignData = {
      image: req.file.filename,
      title: req.body.title,
      titleAr: req.body.titleAr,
      description: req.body.description,
      descriptionAr: req.body.descriptionAr,
      category: req.body.category,
      categoryAr: req.body.categoryAr,
      details: {
        title: details.title,
        titleAr: details.titleAr,
        description1: details.description1,
        description1Ar: details.description1Ar,
        description2: details.description2,
        description2Ar: details.description2Ar,
      },
    };

    // Validate Arabic fields
    const requiredFields = [
      "titleAr",
      "descriptionAr",
      "categoryAr",
      "details.titleAr",
      "details.description1Ar",
      "details.description2Ar",
    ];

    for (const field of requiredFields) {
      if (!field.includes(".")) {
        if (!campaignData[field]) {
          return res.status(400).json({ message: `${field} is required` });
        }
      } else {
        const [parent, child] = field.split(".");
        if (!campaignData[parent][child]) {
          return res.status(400).json({ message: `${field} is required` });
        }
      }
    }

    const campaign = new CurrentCampaign(campaignData);
    const savedCampaign = await campaign.save();
    res.status(201).json(savedCampaign);
  } catch (error) {
    // ...existing error handling...
  }
};

const updateCurrentCampaign = async (req, res) => {
  try {
    // ...existing validation...

    let details = null;
    if (req.body.details) {
      try {
        details = JSON.parse(req.body.details);
      } catch (error) {
        return res.status(400).json({ message: "Invalid details format" });
      }
    }

    const updateData = {
      title: req.body.title,
      titleAr: req.body.titleAr,
      description: req.body.description,
      descriptionAr: req.body.descriptionAr,
      category: req.body.category,
      categoryAr: req.body.categoryAr,
    };

    if (req.file) {
      updateData.image = req.file.filename;
    }

    if (details) {
      updateData.details = {
        title: details.title,
        titleAr: details.titleAr,
        description1: details.description1,
        description1Ar: details.description1Ar,
        description2: details.description2,
        description2Ar: details.description2Ar,
      };
    }

    // ...rest of existing update logic...
  } catch (error) {
    // ...existing error handling...
  }
};

// ...rest of existing code...
