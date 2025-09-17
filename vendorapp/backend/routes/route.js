const router = require('express').Router();
const authMiddleware = require('../middleware/authMiddleware.js');

const {
    vendorRegister,
    vendorLogIn
} = require('../controllers/vendorController.js');

const {
    serviceCreate,
    getServices,
    getServiceDetail,
    searchService,
    searchServicebyCategory,
    searchServicebySubCategory,
    getVendorServices,
    updateService,
    deleteService,
    deleteServices,
    deleteServiceReview,
    deleteAllServiceReviews,
    addReview,
    getInterestedCouples,
    getAddedToInvoiceServices,
} = require('../controllers/serviceController.js');

const {
    coupleRegister,
    coupleLogIn,
    getInvoiceDetail,
    invoiceUpdate
} = require('../controllers/coupleController.js');

const {
    newBooking,
    getBookingedServicesByCouple,
    getBookingedServicesByVendor
} = require('../controllers/bookingController.js');


// Vendor
router.post('/VendorRegister', vendorRegister);
router.post('/VendorLogin', vendorLogIn);

// Service
router.post('/ServiceCreate', serviceCreate);
router.get('/getVendorServices/:id', getVendorServices);
router.get('/getServices', getServices);
router.get('/getServiceDetail/:id', getServiceDetail);
router.get('/getInterestedCouples/:id', getInterestedCouples);
router.get('/getAddedToInvoiceServices/:id', getAddedToInvoiceServices);

router.put('/ServiceUpdate/:id', updateService);
router.put('/addReview/:id', addReview);

router.get('/searchService/:key', searchService);
router.get('/searchServicebyCategory/:key', searchServicebyCategory);
router.get('/searchServicebySubCategory/:key', searchServicebySubCategory);

router.delete('/DeleteService/:id', deleteService);
router.delete('/DeleteServices/:id', deleteServices);
router.put('/deleteServiceReview/:id', deleteServiceReview);
router.delete('/deleteAllServiceReviews/:id', deleteAllServiceReviews);

// Couple
router.post('/CoupleRegister', coupleRegister);
router.post('/CoupleLogin', coupleLogIn);
router.get('/getInvoiceDetail/:id', getInvoiceDetail);
router.put('/CoupleUpdate/:id', invoiceUpdate);

// Booking
router.post('/newBooking', newBooking);
router.get('/getBookingedServicesByCouple/:id', getBookingedServicesByCouple);
router.get('/getBookingedServicesByVendor/:id', getBookingedServicesByVendor);

module.exports = router;