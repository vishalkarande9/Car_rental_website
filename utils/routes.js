const express = require("express");
const form=require("./../api/form.js");
const login=require("./../api/login.js");
const register=require("./../api/register.js");
const manager=require("./../api/manager.js");


const router = express.Router();

router.post('/customer/formget',form.get) 
router.post('/formCheck',form.check) 
router.post('/search',form.search)
router.post('/book',form.book)
router.post('/viewreservation',form.viewreservation)
router.post('/cancelreservation',form.cancelreservation)

router.post('/login',login.auth)

router.post('/register/customer',register.registerCustomer) 
router.post('/register/manager',register.registerManager)


router.post('/manager/addcar',manager.addCar) 
router.post('/manager/getrlid',manager.getrlid)
router.post('/manager/deletecar',manager.deleteCar)
router.get('/manager/getcar',manager.getCar)
router.post('/manager/viewcar',manager.viewCar)

router.post('/admin/getcars',manager.admingetcar)
router.post('/admin/getstore',manager.admingetstore)






module.exports = router; 



