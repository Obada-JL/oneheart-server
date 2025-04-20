const mongoose = require("mongoose");

const completedProjectSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    titleAr: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    categoryAr: {
      type: String,
      required: true,
    },
    donationLinks: [
      {
        icon: {
          type: String,
          required: false
        },
        methodName: {
          type: String,
          required: true
        },
        link: {
          type: String,
          required: true
        }
      }
    ],
    details: [
      {
        fund: {
          type: String,
          required: true,
        },
        fundAr: {
          type: String,
          required: true,
        },
        location: {
          type: String,
          required: true,
        },
        locationAr: {
          type: String,
          required: true,
        },
        duration: {
          type: String,
          required: true,
        },
        durationAr: {
          type: String,
          required: true,
        },
        Beneficiary: {
          type: String,
          required: true,
        },
        BeneficiaryAr: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CompletedProject", completedProjectSchema);
