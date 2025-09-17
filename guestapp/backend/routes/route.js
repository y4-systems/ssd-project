const router = require("express").Router();

// const { adminRegister, adminLogIn, deleteAdmin, getAdminDetail, updateAdmin } = require('../controllers/admin-controller.js');

const {
  adminRegister,
  adminLogIn,
  getAdminDetail,
} = require("../controllers/admin-controller.js");

const {
  stableCreate,
  stableList,
  deleteStable,
  deleteStablees,
  getStableDetail,
  getStableGuests,
} = require("../controllers/table-controller.js");
const {
  complainCreate,
  complainList,
} = require("../controllers/complain-controller.js");
const {
  noticeCreate,
  noticeList,
  deleteNotices,
  deleteNotice,
  updateNotice,
} = require("../controllers/notice-controller.js");
const {
  guestRegister,
  guestLogIn,
  getGuests,
  getGuestDetail,
  deleteGuests,
  deleteGuest,
  updateGuest,
  guestAttendance,
  deleteGuestsByTable,
  updateExamResult,
  clearAllGuestsAttendanceByPreference,
  clearAllGuestsAttendance,
  removeGuestAttendanceByPreference,
  removeGuestAttendance,
} = require("../controllers/guest_controller.js");
const {
  preferenceCreate,
  tablePreferences,
  deletePreferencesByTable,
  getPreferenceDetail,
  deletePreference,
  freePreferenceList,
  allPreferences,
  deletePreferences,
} = require("../controllers/preference-controller.js");
const {
  vendorRegister,
  vendorLogIn,
  getVendors,
  getVendorDetail,
  deleteVendors,
  deleteVendorsByTable,
  deleteVendor,
  updateVendorPreference,
  vendorAttendance,
} = require("../controllers/vendor-controller.js");
const {
  coupleRegister,
  coupleLogIn,
} = require("../controllers/couple-controller.js");
const {
  financeManagerRegister,
  financeManagerLogIn,
} = require("../controllers/financemanager-controller.js");

// Admin
router.post("/AdminReg", adminRegister);
router.post("/AdminLogin", adminLogIn);

router.get("/Admin/:id", getAdminDetail);
// router.delete("/Admin/:id", deleteAdmin)

// router.put("/Admin/:id", updateAdmin)

// Guest

router.post("/GuestReg", guestRegister);
router.post("/GuestLogin", guestLogIn);

router.get("/Guests/:id", getGuests);
router.get("/Guest/:id", getGuestDetail);

router.delete("/Guests/:id", deleteGuests);
router.delete("/GuestsTable/:id", deleteGuestsByTable);
router.delete("/Guest/:id", deleteGuest);

router.put("/Guest/:id", updateGuest);

router.put("/UpdateExamResult/:id", updateExamResult);

router.put("/GuestAttendance/:id", guestAttendance);

router.put(
  "/RemoveAllGuestsSubAtten/:id",
  clearAllGuestsAttendanceByPreference
);
router.put("/RemoveAllGuestsAtten/:id", clearAllGuestsAttendance);

router.put("/RemoveGuestSubAtten/:id", removeGuestAttendanceByPreference);
router.put("/RemoveGuestAtten/:id", removeGuestAttendance);

// Vendor

router.post("/VendorReg", vendorRegister);
router.post("/VendorLogin", vendorLogIn);

router.get("/Vendors/:id", getVendors);
router.get("/Vendor/:id", getVendorDetail);

router.delete("/Vendors/:id", deleteVendors);
router.delete("/VendorsTable/:id", deleteVendorsByTable);
router.delete("/Vendor/:id", deleteVendor);

router.put("/VendorPreference", updateVendorPreference);

router.post("/VendorAttendance/:id", vendorAttendance);

//Couple

router.post("/CoupleReg", coupleRegister);
router.post("/CoupleLogin", coupleLogIn);

router.post("/FinanceManagerReg", financeManagerRegister);
router.post("/FinanceManagerLogin", financeManagerLogIn);

// Notice

router.post("/NoticeCreate", noticeCreate);

router.get("/NoticeList/:id", noticeList);

router.delete("/Notices/:id", deleteNotices);
router.delete("/Notice/:id", deleteNotice);

router.put("/Notice/:id", updateNotice);

// Complain

router.post("/ComplainCreate", complainCreate);

router.get("/ComplainList/:id", complainList);

// Stable

router.post("/StableCreate", stableCreate);

router.get("/StableList/:id", stableList);
router.get("/Stable/:id", getStableDetail);

router.get("/Stable/Guests/:id", getStableGuests);

router.delete("/Stablees/:id", deleteStablees);
router.delete("/Stable/:id", deleteStable);

// Preference

router.post("/PreferenceCreate", preferenceCreate);

router.get("/AllPreferences/:id", allPreferences);
router.get("/TablePreferences/:id", tablePreferences);
router.get("/FreePreferenceList/:id", freePreferenceList);
router.get("/Preference/:id", getPreferenceDetail);

router.delete("/Preference/:id", deletePreference);
router.delete("/Preferences/:id", deletePreferences);
router.delete("/PreferencesTable/:id", deletePreferencesByTable);

module.exports = router;
