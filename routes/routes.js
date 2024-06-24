const express = require('express');
const router = express.Router();
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

const {registeruser, loginUser, logout, addpatient, addgiver, editpatient, 
                 editgiver, getpatient, getgiver, allpatient, addapp, patientapps, patientappx, editpatientapp,
                  addpay, getpay, patientpays, makepay, allpays, allapps, patientGiver} = require('../controllers/authController');


router.post('/register', registeruser);
router.post('/login', loginUser);
router.post('/addpatient', addpatient);
router.post('/addgiver', addgiver);
router.post('/editpatient', editpatient);
router.post('/editgiver', editgiver);
router.get('/getpatient/:id', getpatient);
router.get('/getgiver/:id', getgiver);
router.post('/allpatient', allpatient);
router.post('/addapp', addapp);
router.get('/patientapps/:id', patientapps);
router.get('/patientgiver/:id', patientGiver);
router.post('/logout', logout);
router.put('/editpatientapp', editpatientapp);
router.post('/allapps', allapps);


module.exports = router;