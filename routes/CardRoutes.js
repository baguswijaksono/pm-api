const express = require('express');
const card = require('../controllers/CardController');
const mid = require('../library/Middleware');
const router = express.Router();

// GET
router.get('/:list_card_id/comment', mid.cardAuth, card.getComment); // DONE
router.get('/:list_card_id/member', mid.cardAuth, card.getMember); // DONE
router.get('/:list_card_id/cover', mid.cardAuth, card.getCover); // DONE
router.get('/:list_card_id/checklist', mid.cardAuth, card.getChecklist); // DONE
router.get('/:list_card_id/label', mid.cardAuth, card.getLabel); // DONE
router.get('/:list_card_id/attachments', mid.cardAuth, card.getAttachments); // DONE
router.get('/:list_card_id/date', mid.cardAuth, card.getDate);// DONE
router.get('/:list_card_id/activity', mid.cardAuth, card.getCardActivity);// DONE

// POST
router.post('/:list_card_id/comment', mid.cardEditAuth, card.addComment); // DONE
router.post('/:list_card_id/member', mid.cardEditAuth, card.addCardMember); // DONE
router.post('/:list_card_id/label', mid.cardEditAuth, card.addCardLabel); // DONE
router.post('/:list_card_id/date', mid.cardEditAuth, card.addDate); // DONE
router.post('/:list_card_id/checklist', mid.cardEditAuth, card.addChecklist); // DONE
router.post('/:list_card_id/cover', mid.cardEditAuth, card.addCover); // DONE
router.post('/:list_card_id/attachments', mid.cardEditAuth, card.addAttachments); // DONE

// PUT
router.put('/:list_card_id/comment/:id', mid.cardCommentEditAuth, card.changeComment); // DONE
router.put('/:list_card_id/label/:id', mid.cardEditAuth, card.changeLabel);// DONE
router.put('/:list_card_id/checklist/:id/title', mid.cardEditAuth, card.changeChecklist); // DONE
router.put('/:list_card_id/checklist/:id/done', mid.cardEditAuth, card.setChecklistDone); // DONE
router.put('/:list_card_id/checklist/:id/not-yet', mid.cardEditAuth, card.setChecklistOnTheWay); // DONE
router.put('/:list_card_id/cover', mid.cardEditAuth, card.changeCover); // DONE
router.put('/:list_card_id/date/:id', mid.cardEditAuth, card.changeDate); // DONE

// DELETE
router.delete('/:list_card_id/date/:id', mid.cardEditAuth, card.deleteDate); // DONE
router.delete('/:list_card_id/checklist/:id', mid.cardEditAuth, card.deleteChecklist); // DONE
router.delete('/:list_card_id/label/:id', mid.cardEditAuth, card.removeCardLabel); // DONE
router.delete('/:list_card_id/comment/:id', mid.cardCommentEditAuth, card.deleteComment); // DONE
router.delete('/:list_card_id/member/:id', mid.cardEditAuth, card.removeCardMember); // DONE 
router.delete('/:list_card_id', mid.cardEditAuth, card.deleteCard);  // DONE
router.delete('/:list_card_id/cover', mid.cardEditAuth, card.deleteCover); // DONE
router.delete('/:list_card_id/attachments/:id', mid.cardEditAuth, card.deleteAttachments);// DONE

module.exports = router;
