const express = require('express');
const admin = require('../controllers/AdminController');
const mid = require('../library/Middleware');
const router = express.Router();

// GET
router.get('/users', mid.adminAuth, admin.getUser); // DONE
router.get('/workspace', mid.adminAuth, admin.getWorkspace); 
router.get('/board', mid.adminAuth, admin.getUser); 

// POST
router.post('/workspace', mid.adminAuth, admin.addWorkspaceType); // DONE

// PUT
router.put('/workspace/:id', mid.adminAuth, admin.changeWorkspaceType); // DONE

//DELETE
router.delete('/workspace/:id', mid.adminAuth, admin.deleteWorkspaceType);  // DONE

module.exports = router;
