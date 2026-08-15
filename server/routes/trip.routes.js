const express = require("express");
const {
  getAllTrips,
  createTrip,
  getSingleTrip,
  updateTrip,
  deleteTrip,
  duplicateTrip,
} = require("../controllers/trip.controller");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect); // Secure all trip routes

router.route("/")
  .get(getAllTrips)
  .post(createTrip);

router.route("/:id")
  .get(getSingleTrip)
  .put(updateTrip)
  .delete(deleteTrip);

router.post("/:id/duplicate", duplicateTrip);

module.exports = router;
