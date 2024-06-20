const express = require('express');
const user = require('../controllers/UserController');
const mid = require('../library/Middleware');
const router = express.Router();

// GET
router.get('/', mid.userAuth, user.getUserById); // DONE
router.get('/all', mid.userAuth, user.getAllUser); // DONE
router.get('/workspace', mid.userAuth, user.getUserWorkspace); // DONE
router.get('/board', mid.userAuth, user.getUserBoard); // DONE
router.get('/invite', mid.userAuth, user.getInvite); // DONE
router.get('/starred', mid.userAuth, user.getStarredBoard); // DONE
router.get('/recent', mid.userAuth, user.getRecentBoard); // DONE
router.get('/activity', mid.userAuth, user.getUserActivity); // DONE
router.get('/notification', mid.userAuth, user.getUserNotification); // DONE

// POST
router.post('/', user.createUser); // DONE Sepenuhnya
router.post('/login', user.loginUser); // DONE Sepenuhnya

// PUT
router.put('/email', mid.userAuth, user.changeEmail); // DONE
router.put('/username', mid.userAuth, user.changeUsername); // DONE
router.put('/bio', mid.userAuth, user.changeBio); // DONE
router.put('/password', mid.userAuth, user.changePassword); // DONE

// DELETE
router.delete('/notification', mid.userAuth, user.deleteUserNotification); // DONE
router.delete('/star/:board_id', mid.userAuth, user.removeStar); // DONE
router.delete('/refuse/:invitation_id', mid.userAuth ,user.refuseInvitation);// DONE
module.exports = router;
