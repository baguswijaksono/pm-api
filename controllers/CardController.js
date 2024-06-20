const conn = require('../library/conn');
const { addUserActivity, addUserNotification } = require('../controllers/UserController');

const getCover = (req, res) => {
  const list_card_id = req.params.list_card_id;

  const query = `
  SELECT lcc.*, tu.username, tu.email
  FROM tbl_list_card_covers AS lcc
  JOIN tbl_users AS tu ON lcc.adder_id = tu.id
  WHERE lcc.list_card_id = ?;  
  `;

  conn.query(query, [list_card_id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).json(result);
  });
};

const getCardActivity = (req, res) => {
  const list_card_id = req.params.list_card_id;

  const query = `
  SELECT 
    ua.id,
    ua.user_id,
    u.email AS user_email,
    u.username AS user_username,
    ua.action_id,
    a.name AS action_name,
    ua.list_card_id,
    ua.detailed,
    ua.created_at,
    ua.updated_at
  FROM 
    tbl_user_activitys ua
  JOIN 
    tbl_users u ON ua.user_id = u.id
  JOIN 
    tbl_user_action_on_boards a ON ua.action_id = a.id
  WHERE 
    ua.list_card_id = ?
  ORDER BY 
    ua.created_at DESC;
  `;

  conn.query(query, [list_card_id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).json(result);
  });
};

const getComment = (req, res) => {
  const list_card_id = req.params.list_card_id;

  const query = `
  SELECT 
  c.id AS comment_id, 
  c.list_card_id, 
  c.comment, 
  c.created_at AS comment_created_at, 
  c.updated_at AS comment_updated_at,
  u.id AS user_id,
  u.email,
  u.username
FROM 
  tbl_list_card_comments c
JOIN 
  tbl_users u
ON 
  c.userid = u.id
WHERE 
  c.list_card_id = ?;
  `;

  conn.query(query, [list_card_id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).json(result);
  });
};

const getMember = (req, res) => {
  const list_card_id = req.params.list_card_id;

  const query = `
  SELECT 
  lcm.id AS member_id,
  lcm.list_card_id,
  lcm.user_id,
  u1.username AS member_username,
  u1.email AS member_email,
  lcm.created_at AS member_created_at,
  lcm.updated_at AS member_updated_at,
  lcm.adder_id,
  u2.username AS adder_username,
  u2.email AS adder_email
FROM 
  tbl_list_card_members lcm
JOIN 
  tbl_users u1 ON lcm.user_id = u1.id
LEFT JOIN 
  tbl_users u2 ON lcm.adder_id = u2.id
WHERE 
  lcm.list_card_id = ?;

  `;

  conn.query(query, [list_card_id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).json(result);
  });
};

const getChecklist = (req, res) => {
  const list_card_id = req.params.list_card_id;

  const query = `
  SELECT 
  lcc.id AS checklist_id,
  lcc.list_card_id,
  lcc.title AS checklist_title,
  lcc.status_id,
  lcs.name AS status_name,
  lcc.adder_id,
  u.username AS adder_username,
  lcc.created_at AS checklist_created_at,
  lcc.updated_at AS checklist_updated_at
FROM 
  tbl_list_card_checklists AS lcc
LEFT JOIN 
  tbl_list_card_status AS lcs ON lcc.status_id = lcs.id
LEFT JOIN 
  tbl_users AS u ON lcc.adder_id = u.id
WHERE 
  lcc.list_card_id = ?;
  `;

  conn.query(query, [list_card_id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).json(result);
  });
};

const getLabel = (req, res) => {
  const list_card_id = req.params.list_card_id;

  const query = `
  SELECT 
  lcl.id AS label_id,
  lcl.list_card_id,
  lcl.color,
  lcl.title AS label_title,
  lcl.created_at AS label_created_at,
  lcl.updated_at AS label_updated_at,
  u.username AS adder_username
FROM 
  tbl_list_card_labels AS lcl
LEFT JOIN 
  tbl_users AS u ON lcl.adder_id = u.id
WHERE 
  lcl.list_card_id = ?;

  `;

  conn.query(query, [list_card_id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).json(result);
  });
};

const addComment = (req, res) => {
  const { comment } = req.body;
  const list_card_id = req.params.list_card_id;
  const query = `
      INSERT INTO tbl_list_card_comments (list_card_id, comment,userid)
      VALUES (?, ? ,? );
    `;

  conn.query(query, [list_card_id, comment, req.userId], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(201).json({ message: 'Comment added successfully', insertId: result.insertId });
  });
};

const addDate = (req, res) => {
  const { deadline } = req.body;
  const list_card_id = req.params.list_card_id;
  const checkQuery = `
    SELECT * FROM tbl_list_card_dates 
    WHERE list_card_id = ?;
  `;

  conn.query(checkQuery, [list_card_id], (checkErr, checkResult) => {
    if (checkErr) {
      return res.status(500).send(checkErr);
    }

    if (checkResult.length > 0) {
      return res.status(409).json({ message: 'Deadline already exists for the card' });
    }
    const insertQuery = `
      INSERT INTO tbl_list_card_dates (list_card_id, deadline, adder_id)
      VALUES (?, ?, ?);
    `;

    conn.query(insertQuery, [list_card_id, deadline, req.userId], (insertErr, result) => {
      if (insertErr) {
        return res.status(500).send(insertErr);
      }
      addUserActivity(req.userId, 3, list_card_id, 'added date deadline into the card')
      res.status(201).json({ message: 'Date added successfully', insertId: result.insertId });
    });
  });
};

const addCardMember = (req, res) => {
  const { user_id } = req.body;
  const list_card_id = req.params.list_card_id;

  const checkQuery = `
    SELECT * FROM tbl_list_card_members 
    WHERE list_card_id = ? AND user_id = ?;
  `;

  conn.query(checkQuery, [list_card_id, user_id], (checkErr, checkResult) => {
    if (checkErr) {
      return res.status(500).send(checkErr);
    }

    if (checkResult.length > 0) {
      return res.status(409).json({ message: 'Card member already exists' });
    }

    const insertQuery = `
      INSERT INTO tbl_list_card_members (list_card_id, user_id, adder_id)
      VALUES (?, ?, ?);
    `;

    conn.query(insertQuery, [list_card_id, user_id, req.userId], (insertErr, result) => {
      if (insertErr) {
        return res.status(500).send(insertErr);
      }

      const getUsernamesQuery = `
        SELECT u1.username as added_username, u2.username as adder_username, c.title as card_title
        FROM tbl_users u1
        JOIN tbl_users u2 ON u2.id = ?
        JOIN tbl_list_cards c ON c.id = ?
        WHERE u1.id = ?;
      `;

      conn.query(getUsernamesQuery, [req.userId, list_card_id, user_id], (userErr, userResult) => {
        if (userErr) {
          return res.status(500).send(userErr);
        }

        if (userResult.length === 0) {
          return res.status(404).json({ message: 'User or card not found' });
        }

        const { added_username, adder_username, card_title } = userResult[0];
        
        addUserActivity(req.userId, 1, list_card_id, `added ${added_username} to card`);
        const description = `You have been assigned by ${adder_username} to the card "${card_title}"`;
        const query = `
          INSERT INTO tbl_user_notifications (user_id, notification) 
          VALUES (?, ?);
        `;
    
        conn.query(query, [req.userId, description], (err, result) => {
          if (err) {
            return res.status(500).send(err);
          }
          res.status(201).json({ message: 'Card member added successfully', insertId: result.insertId });
        });
      });
    });
  });
};



const addCardLabel = (req, res) => {
  const { color, title } = req.body;
  const list_card_id = req.params.list_card_id;
  const queryInsertLabel = `
    INSERT INTO tbl_list_card_labels (list_card_id, color, title, adder_id)
    VALUES (?, ?, ?, ?);
  `;
  conn.query(queryInsertLabel, [list_card_id, color, title, req.userId], (errInsert, resultInsert) => {
    if (errInsert) {
      return res.status(500).send(errInsert);
    }
    addUserActivity(req.userId, 2, list_card_id, `added label "${title}" to the card`);
    res.status(201).json({ message: 'Card label added successfully', insertId: resultInsert.insertId });
  });
};

const addChecklist = (req, res) => {
  const { title } = req.body;
  const list_card_id = req.params.list_card_id;
  const query = `
    INSERT INTO tbl_list_card_checklists (list_card_id, title, adder_id)
    VALUES (?, ?, ?);
  `;

  conn.query(query, [list_card_id, title, req.userId], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    addUserActivity(req.userId, 4, list_card_id, `added checklist "${title}" to the card`);
    res.status(201).json({ message: 'Checklist added successfully', insertId: result.insertId });
  });
};

const getDate = (req, res) => {
  const list_card_id = req.params.list_card_id;

  const query = `
  SELECT lc.id, u.username AS adder_username, u.email AS adder_email, lc.adder_id, lc.deadline, lc.created_at, lc.updated_at
  FROM tbl_users u
  JOIN tbl_list_card_dates lc ON u.id = lc.adder_id
  WHERE lc.list_card_id = ?;  
  `;

  conn.query(query, [list_card_id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).json(result);
  });
};

const archiveCard = (req, res) => {
  const { id } = req.params;

  const query = `
      UPDATE list_card
      SET archived_status_id = '2'
      WHERE id = ?;
    `;

  conn.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Card not found' });
    }
    res.status(200).json({ message: 'Card archived successfully' });
  });
};

const changeTitle = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const query = `
      UPDATE tbl_list_card
      SET title = ?
      WHERE id = ?;
    `;

  conn.query(query, [title, id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Card not found' });
    }
    res.status(200).json({ message: 'Title updated successfully' });
  });
};

const setChecklistDone = (req, res) => {
  const { id } = req.params;
  const selectQuery = 'SELECT title FROM tbl_list_card_checklists WHERE id = ?';
  conn.query(selectQuery, [id], (err, selectResult) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (selectResult.length === 0) {
      return res.status(404).json({ message: 'Checklist item not found' });
    }

    const title = selectResult[0].title;

    const updateQuery = `
      UPDATE tbl_list_card_checklists 
      SET status_id = '2' 
      WHERE id = ?;
    `;
    conn.query(updateQuery, [id], (err, updateResult) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (updateResult.affectedRows === 0) {
        return res.status(404).json({ message: 'Checklist item not found' });
      }
      addUserActivity(req.userId, 10, req.list_card_id, `change checklist "${title}" status to done`);
      res.status(200).json({ message: 'Checklist item set to done successfully' });
    });
  });
};


const setChecklistOnTheWay = (req, res) => {
  const { id } = req.params;
  const selectQuery = 'SELECT title FROM tbl_list_card_checklists WHERE id = ?';
  conn.query(selectQuery, [id], (err, selectResult) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (selectResult.length === 0) {
      return res.status(404).json({ message: 'Checklist item not found' });
    }

    const title = selectResult[0].title;

    const updateQuery = `
      UPDATE tbl_list_card_checklists 
      SET status_id = '1' 
      WHERE id = ?;
    `;

    conn.query(updateQuery, [id], (err, updateResult) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (updateResult.affectedRows === 0) {
        return res.status(404).json({ message: 'Checklist item not found' });
      }

      addUserActivity(req.userId, 10, req.list_card_id, `change checklist "${title}" status to on the way`);
      res.status(200).json({ message: 'Checklist item set to on the way successfully' });
    });
  });
};


const changeComment = (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;

  const query = `
      UPDATE tbl_list_card_comments
      SET comment = ?
      WHERE id = ?;
    `;

  conn.query(query, [comment, id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    res.status(200).json({ message: 'Comment updated successfully' });
  });
};

const changeDate = (req, res) => {
  const { id } = req.params;
  const { deadline } = req.body;

  if (!deadline || isNaN(Date.parse(deadline))) {
    return res.status(400).json({ message: 'Invalid deadline format' });
  }

  const query = `
    UPDATE tbl_list_card_dates
    SET deadline = ?
    WHERE id = ?;
  `;

  conn.query(query, [deadline, id], (err, result) => {
    if (err) {
      console.error("Error updating date:", err);
      return res.status(500).json({ message: 'Failed to update date' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Date not found' });
    }
    addUserActivity(req.userId, 12, req.list_card_id, `updated date deadline to ${deadline}`);
    res.status(200).json({ message: 'Date updated successfully' });
  });
};


const deleteDate = (req, res) => {
  const { id } = req.params;

  const query = `
    DELETE FROM tbl_list_card_dates
    WHERE id = ?;
  `;

  conn.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Date not found' });
    }
    addUserActivity(req.userId, 13, req.list_card_id, `removed date deadline`);
    res.status(200).json({ message: 'Date deleted successfully' });
  });
};


const changeLabel = (req, res) => {
  const { id } = req.params;
  const { title, color } = req.body;
  const selectQuery = 'SELECT title, color FROM `tbl_list_card_labels` WHERE `id` = ?';
  conn.query(selectQuery, [id], (selectErr, selectResult) => {
    if (selectErr) {
      return res.status(500).send(selectErr);
    }

    if (selectResult.length === 0) {
      return res.status(404).json({ message: 'Label not found' });
    }

    const oldTitle = selectResult[0].title;
    const oldColor = selectResult[0].color;

    let updates = [];
    let queryParams = [];
    if (title) {
      updates.push('title = ?');
      queryParams.push(title);
    }
    if (color) {
      updates.push('color = ?');
      queryParams.push(color);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    let query = 'UPDATE tbl_list_card_labels SET ' + updates.join(', ') + ' WHERE id = ?';
    queryParams.push(id);

    conn.query(query, queryParams, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }

      let activityMessage = '';
      if (title && color) {
        activityMessage = `Updated label "${oldTitle}" (color: ${oldColor}) to "${title}" (color: ${color})`;
      } else if (title && !color) {
        activityMessage = `Updated label "${oldTitle}" to "${title}"`;
      } else if (!title && color) {
        activityMessage = `Updated label "${oldTitle}" color to "${color}"`;
      }
      addUserActivity(req.userId, 7, req.list_card_id, activityMessage);

      res.status(200).json({ message: 'Label updated successfully' });
    });
  });
};

const changeChecklist = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const selectQuery = `
    SELECT title, list_card_id FROM tbl_list_card_checklists WHERE id = ?;
  `;

  conn.query(selectQuery, [id], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Checklist not found' });
    }

    const oldTitle = results[0].title;
    const listCardId = results[0].list_card_id;
    const updateQuery = `
      UPDATE tbl_list_card_checklists
      SET title = ? WHERE id = ?;
    `;

    conn.query(updateQuery, [title, id], (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Checklist not found' });
      }

      addUserActivity(req.userId, 8, listCardId, `updated checklist "${oldTitle}" to "${title}"`);

      res.status(200).json({ message: 'Checklist updated successfully' });
    });
  });
};

const deleteComment = (req, res) => {
  const { id } = req.params;

  const query = `
      DELETE FROM tbl_list_card_comments
      WHERE id = ?;
    `;

  conn.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    res.status(200).json({ message: 'Comment deleted successfully' });
  });
};

const removeCardMember = (req, res) => {
  const { id } = req.params;

  const getCardMemberQuery = `
    SELECT user_id, list_card_id FROM tbl_list_card_members WHERE id = ?;
  `;

  conn.query(getCardMemberQuery, [id], (getCardMemberErr, cardMemberResult) => {
    if (getCardMemberErr) {
      return res.status(500).send(getCardMemberErr);
    }

    if (cardMemberResult.length === 0) {
      return res.status(404).json({ message: 'Member not found' });
    }

    const { user_id, list_card_id } = cardMemberResult[0];

    const getUsernameQuery = `
      SELECT username FROM tbl_users WHERE id = ?;
    `;

    conn.query(getUsernameQuery, [user_id], (getUsernameErr, userResult) => {
      if (getUsernameErr) {
        return res.status(500).send(getUsernameErr);
      }

      if (userResult.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      const username = userResult[0].username;

      const deleteQuery = `
        DELETE FROM tbl_list_card_members WHERE id = ?;
      `;

      conn.query(deleteQuery, [id], (deleteErr, deleteResult) => {
        if (deleteErr) {
          return res.status(500).send(deleteErr);
        }

        if (deleteResult.affectedRows === 0) {
          return res.status(404).json({ message: 'Member not found' });
        }

        addUserActivity(req.userId, 16, list_card_id, `removed ${username} from card`);
        res.status(200).json({ message: 'Card member removed successfully' });
      });
    });
  });
};


const removeCardLabel = (req, res) => {
  const { id } = req.params;
  const querySelect = `
    SELECT list_card_id, title 
    FROM tbl_list_card_labels 
    WHERE id = ?;
  `;

  conn.query(querySelect, [id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.length === 0) {
      return res.status(404).json({ message: 'Label not found' });
    }

    const { list_card_id, title } = result[0];
    const queryDelete = `
      DELETE FROM tbl_list_card_labels
      WHERE id = ?;
    `;

    conn.query(queryDelete, [id], (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Label not found' });
      }

      addUserActivity(req.userId, 15, list_card_id, `removed label ${title} from card`);
      res.status(200).json({ message: 'Card label removed successfully' });
    });
  });
};

const deleteChecklist = (req, res) => {
  const { id } = req.params;
  const selectQuery = 'SELECT title FROM tbl_list_card_checklists WHERE id = ?';
  conn.query(selectQuery, [id], (err, selectResult) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (selectResult.length === 0) {
      return res.status(404).json({ message: 'Checklist not found' });
    }

    const title = selectResult[0].title;

    const deleteQuery = `
      DELETE FROM tbl_list_card_checklists
      WHERE id = ?;
    `;
    conn.query(deleteQuery, [id], (err, deleteResult) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (deleteResult.affectedRows === 0) {
        return res.status(404).json({ message: 'Checklist not found' });
      }
      addUserActivity(req.userId, 14, req.list_card_id, `remove checklist "${title}" from the card`);
      res.status(200).json({ message: 'Checklist deleted successfully' });
    });
  });
};


const addCover = (req, res) => {
  const list_card_id = req.list_card_id;
  const { cover } = req.body;

  if (!cover) {
    return res.status(400).json({ message: 'Cover URL is required' });
  }

  const checkQuery = `
    SELECT * FROM tbl_list_card_covers WHERE list_card_id = ?;
  `;

  conn.query(checkQuery, [list_card_id], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (results.length > 0) {
      return res.status(400).json({ message: 'A cover already exists for this card' });
    }

    const insertQuery = `
      INSERT INTO tbl_list_card_covers (list_card_id, cover , adder_id ) 
      VALUES (?, ? , ?);
    `;

    const values = [list_card_id, cover, req.userId];

    conn.query(insertQuery, values, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      addUserActivity(req.userId, 5, list_card_id, `added cover to card`);
      res.status(200).json({ message: 'Cover added successfully' });
    });
  });
};

const changeCover = (req, res) => {
  const { list_card_id } = req.params;
  const { cover } = req.body;

  if (!cover) {
    return res.status(400).json({ message: 'Cover URL is required' });
  }

  const query = `
    UPDATE tbl_list_card_covers
    SET cover = ?
    WHERE list_card_id = ?;
  `;

  const values = [cover, list_card_id];

  conn.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Card not found or cover not updated' });
    }
    addUserActivity(req.userId, 11, list_card_id, `updated card cover`);
    res.status(200).json({ message: 'Cover updated successfully' });
  });
};

const deleteCover = (req, res) => {
  const { list_card_id } = req.params;

  const query = `
    DELETE FROM tbl_list_card_covers
    WHERE list_card_id = ?;
  `;

  const values = [list_card_id];

  conn.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Cover not found' });
    }
    addUserActivity(req.userId, 17, list_card_id, `removed card cover`);
    res.status(200).json({ message: 'Cover deleted successfully' });
  });
};


const addAttachments = (req, res) => {
  const { list_card_id } = req.params;
  const { file_path, name } = req.body;
  if (!list_card_id || !file_path || !name) {
    return res.status(400).json({ message: 'list_card_id, file_path, and name are required' });
  }

  const query = `
    INSERT INTO tbl_list_card_attachments (list_card_id, file_path, adder_id, name) 
    VALUES (?, ?, ?, ?);
  `;

  const values = [list_card_id, file_path, req.userId, name];
  conn.query(query, values, (err, result) => {
    if (err) {
      console.error('Error adding attachment:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    addUserActivity(req.userId, 6, list_card_id, `attached a ${name}`);
    res.status(200).json({ message: 'Attachment added successfully' });
  });
};


const deleteAttachments = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'Attachment ID is required' });
  }
  const queryGetName = `SELECT name FROM tbl_list_card_attachments WHERE id = ?`;
  conn.query(queryGetName, [id], (err, results) => {
    if (err) {
      console.error('Error retrieving attachment name:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    const attachmentName = results.length ? results[0].name : '';
    const queryDelete = `DELETE FROM tbl_list_card_attachments WHERE id = ?`;
    conn.query(queryDelete, [id], (err, result) => {
      if (err) {
        console.error('Error deleting attachment:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'No attachment found for this ID' });
      }
      addUserActivity(req.userId, 18, req.list_card_id, `removed ${attachmentName} file`);
      res.status(200).json({ message: 'Attachment deleted successfully' });
    });
  });
};

const deleteCard = (req, res) => {
  const { list_card_id } = req.params;

  const queries = [
    { sql: 'DELETE FROM tbl_list_card_attachments WHERE list_card_id = ?', values: [list_card_id] },
    { sql: 'DELETE FROM tbl_list_card_checklists WHERE list_card_id = ?', values: [list_card_id] },
    { sql: 'DELETE FROM tbl_list_card_comments WHERE list_card_id = ?', values: [list_card_id] },
    { sql: 'DELETE FROM tbl_list_card_covers WHERE list_card_id = ?', values: [list_card_id] },
    { sql: 'DELETE FROM tbl_user_activitys WHERE list_card_id = ?', values: [list_card_id] },
    { sql: 'DELETE FROM tbl_list_card_dates WHERE list_card_id = ?', values: [list_card_id] },
    { sql: 'DELETE FROM tbl_list_card_labels WHERE list_card_id = ?', values: [list_card_id] },
    { sql: 'DELETE FROM tbl_list_card_members WHERE list_card_id = ?', values: [list_card_id] },
    { sql: 'DELETE FROM tbl_list_cards WHERE id = ?', values: [list_card_id] }
  ];

  conn.beginTransaction(err => {
    if (err) {
      return res.status(500).send(err);
    }

    const executeQuery = (index) => {
      if (index < queries.length) {
        const { sql, values } = queries[index];
        conn.query(sql, values, (err, result) => {
          if (err) {
            return conn.rollback(() => {
              res.status(500).send(err);
            });
          }
          executeQuery(index + 1);
        });
      } else {
        conn.commit(err => {
          if (err) {
            return conn.rollback(() => {
              res.status(500).send(err);
            });
          }
          res.status(200).json({ message: 'Card and related data deleted successfully' });
        });
      }
    };

    executeQuery(0);
  });
};


const getAttachments = (req, res) => {
  const { list_card_id } = req.params;

  const query = `
    SELECT * FROM tbl_list_card_attachments 
    WHERE list_card_id = ?;
  `;

  const values = [list_card_id];

  conn.query(query, values, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'No attachments found for this card' });
    }
    res.status(200).json(results);
  });
};

module.exports = {
  getAttachments, getDate, deleteDate,
  addCover, changeCover, deleteCover, addAttachments, deleteAttachments,
  getCover, getComment, getChecklist, getMember, getLabel, deleteCard,
  addCardLabel, addDate, addChecklist, deleteChecklist, changeChecklist,
  archiveCard, changeTitle, addComment, changeComment, deleteComment,
  setChecklistDone, setChecklistOnTheWay, changeDate, changeLabel,
  addCardMember, removeCardMember, removeCardLabel, getCardActivity
};
