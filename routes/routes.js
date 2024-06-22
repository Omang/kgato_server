const express = require('express');
const router = express.Router();
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

const {registeruser, loginUser, logout, addpatient, addgiver, editpatient, 
                 editgiver, getpatient, getgiver, allpatient, addapp, patientapps, patientappx, editpatientapp,
                  addpay, getpay, patientpays, makepay, allpays} = require('../controllers/authController');


router.post('/register', registeruser);
router.post('/login', loginUser);
router.post('/addpatient', addpatient);
router.post('/addgiver', addgiver);
router.put('/editpatient', editpatient);
router.put('/editgiver', editgiver);
router.get('/getpatient/:id', getpatient);
router.get('/getgiver/:id', getgiver);
router.post('/allpatient', allpatient);
router.post('/addapp', addapp);
router.get('/patientapps/:id', patientapps);
router.post('/logout', logout);
router.put('/editpatientapp', editpatientapp);


module.exports = router;