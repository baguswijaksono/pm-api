const express = require('express');
const list = require('../controllers/ListController');
const mid = require('../library/Middleware');
const router = express.Router();

// GET
router.get('/:list_id/cards', mid.listAuth, list.getCard); // DONE

// POST
router.post('/:list_id/card', mid.listEditAuth, list.addCard); // DONE

// PUT
router.put('/:list_id/card/:card_id', mid.listEditAuth, list.changeCard);  // DONE
router.put('/:list_id/order', mid.listEditAuth, list.changeOrder); // Bermasalah mayan ribet
router.put('/:list_id/title', mid.listEditAuth, list.changeTitle); // DONE

//DELETE
router.delete('/:list_id', mid.listEditAuth, list.permanentDeleteList);  // DONE
module.exports = router;
