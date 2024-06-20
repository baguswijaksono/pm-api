const express = require('express');
const board = require('../controllers/BoardController');
const mid = require('../library/Middleware');
const router = express.Router();

// GET
router.get('/visibility', mid.Auth, board.getBoardVisibility); // DONE
router.get('/previlege', mid.Auth, board.getBoardPrivilege); // DONE
router.get('/:board_id', mid.boardAuth, board.getBoardById); // // DONE
router.get('/:board_id/collaborator', mid.boardAuth, board.getCollaborator); // DONE
router.get('/:board_id/list', mid.boardAuth, board.getList); // DONE

// POST
router.post('/star', mid.Auth, board.starBoard); // DONE 
router.post('/:board_id/collaborator', mid.boardAuth, board.addCollaborator); // DONE
router.post('/:board_id/list', mid.boardCollaboratorsAuth, board.addList);// DONE 
router.post('/:board_id/collaborator/:user_id/ep', mid.boardCollaboratorsAuth, board.GrantCollaboratorEdit);// DONE 

// PUT
router.put('/:board_id', mid.boardCollaboratorsAuth, board.updateBoard); // DONE

// DELETE
router.delete('/:board_id',mid.boardCollaboratorsAuth ,board.deleteBoard); // DONE


module.exports = router;
