const conn = require('../library/conn');
const card = require('../controllers/CardController');

const getCard = (req, res) => {
  const { list_id } = req.params;

  const query = `
    SELECT 
      lc.id AS card_id, 
      lc.title, 
      lc.list_id, 
      lc.archived_status_id, 
      ascol.name AS archived_status_name, 
      lc.created_at AS card_created_at, 
      lc.updated_at AS card_updated_at,
      lc.description
    FROM 
      tbl_list_cards lc
    LEFT JOIN 
      tbl_list_card_archived_status ascol 
    ON 
      lc.archived_status_id = ascol.id
    WHERE 
      lc.list_id = ?;
  `;

  conn.query(query, [list_id], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).json(results);
  });
};



const changeOrder = (req, res) => {
  const { list_id } = req.params;
  const { order } = req.body;

  const getListQuery = `
    SELECT board_id, \`order\`
    FROM tbl_lists
    WHERE id = ?;
  `;

  const shiftOrderQuery = `
    UPDATE tbl_lists
    SET \`order\` = \`order\` + 1
    WHERE board_id = ? AND \`order\` >= ?;
  `;

  const updateOrderQuery = `
    UPDATE tbl_lists
    SET \`order\` = ?
    WHERE id = ?;
  `;

  conn.query(getListQuery, [list_id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }

    if (result.length === 0) {
      return res.status(404).json({ message: 'List not found' });
    }

    const { board_id, currentOrder } = result[0];

    if (order !== currentOrder) {
      conn.query(shiftOrderQuery, [board_id, order], (err) => {
        if (err) {
          return res.status(500).send(err);
        }

        conn.query(updateOrderQuery, [order, list_id], (err, result) => {
          if (err) {
            return res.status(500).send(err);
          }

          res.status(200).json({ message: 'Order updated successfully' });
        });
      });
    } else {
      res.status(200).json({ message: 'Order updated successfully' });
    }
  });
};

const changeTitle = (req, res) => {
  const { list_id } = req.params;
  const { title } = req.body;

  const query = `
      UPDATE tbl_lists
      SET title = ?
      WHERE id = ?;
    `;

  conn.query(query, [title, list_id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'List not found' });
    }
    res.status(200).json({ message: 'Title updated successfully' });
  });
};

const addCard = (req, res) => {
  const { list_id } = req.params;
  const { title, archived_status_id, description } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  const query1 = `
    INSERT INTO \`tbl_list_cards\` (\`title\`, \`list_id\`, \`archived_status_id\`, \`description\`) 
    VALUES (?, ?, ?, ?);
  `;

  const values = [title, list_id, archived_status_id || 1, description || ''];

  conn.query(query1, values, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'List not found' });
    }

    // Success response
    res.status(201).json({ message: 'Card added successfully', cardId: result.insertId });
  });
};

const changeCard = (req, res) => {
  const { card_id } = req.params;
  const { title, list_id, archived_status_id, description } = req.body;

  let fields = [];
  let values = [];

  if (title) {
    fields.push('title = ?');
    values.push(title);
  }
  if (list_id) {
    fields.push('list_id = ?');
    values.push(list_id);
  }
  if (archived_status_id) {
    fields.push('archived_status_id = ?');
    values.push(archived_status_id);
  }
  if (description) {
    fields.push('description = ?');
    values.push(description);
  }

  if (fields.length === 0) {
    return res.status(400).json({ message: 'No fields to update' });
  }

  values.push(card_id);

  const query = `
    UPDATE tbl_list_cards
    SET ${fields.join(', ')}
    WHERE id = ?;
  `;

  conn.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Card not found' });
    }
    res.status(200).json({ message: 'Card updated successfully' });
  });
};

const deleteCard = (req, res) => {
  const { card_id } = req.params;
  const { title, list_id, archived_status_id, description } = req.body;

  let fields = [];
  let values = [];

  if (title) {
    fields.push('title = ?');
    values.push(title);
  }
  if (list_id) {
    fields.push('list_id = ?');
    values.push(list_id);
  }
  if (archived_status_id) {
    fields.push('archived_status_id = ?');
    values.push(archived_status_id);
  }
  if (description) {
    fields.push('description = ?');
    values.push(description);
  }

  if (fields.length === 0) {
    return res.status(400).json({ message: 'No fields to update' });
  }

  values.push(card_id);

  const query = `
    UPDATE tbl_list_cards
    SET ${fields.join(', ')}
    WHERE id = ?;
  `;

  conn.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }

    console.log(query)
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Card not found' });
    }
    res.status(200).json({ message: 'Card updated successfully' });
  });
};

const permanentDeleteList = (req, res) => {
  const { list_id } = req.params;

  const queries = [
    { sql: 'DELETE FROM tbl_list_card_attachments WHERE list_card_id IN (SELECT id FROM tbl_list_cards WHERE list_id = ?)', values: [list_id] },
    { sql: 'DELETE FROM tbl_list_card_checklists WHERE list_card_id IN (SELECT id FROM tbl_list_cards WHERE list_id = ?)', values: [list_id] },
    { sql: 'DELETE FROM tbl_list_card_comments WHERE list_card_id IN (SELECT id FROM tbl_list_cards WHERE list_id = ?)', values: [list_id] },
    { sql: 'DELETE FROM tbl_list_card_covers WHERE list_card_id IN (SELECT id FROM tbl_list_cards WHERE list_id = ?)', values: [list_id] },
    { sql: 'DELETE FROM tbl_list_card_dates WHERE list_card_id IN (SELECT id FROM tbl_list_cards WHERE list_id = ?)', values: [list_id] },
    { sql: 'DELETE FROM tbl_list_card_labels WHERE list_card_id IN (SELECT id FROM tbl_list_cards WHERE list_id = ?)', values: [list_id] },
    { sql: 'DELETE FROM tbl_list_card_members WHERE list_card_id IN (SELECT id FROM tbl_list_cards WHERE list_id = ?)', values: [list_id] },
    { sql: 'DELETE FROM tbl_user_activitys WHERE list_card_id IN (SELECT id FROM tbl_list_cards WHERE list_id = ?)', values: [list_id] },
    { sql: 'DELETE FROM tbl_list_cards WHERE list_id = ?', values: [list_id] },
    { sql: 'DELETE FROM tbl_lists WHERE id = ?', values: [list_id] }
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
          res.status(200).json({ message: 'List and related data deleted successfully' });
        });
      }
    };

    executeQuery(0);
  });
};


module.exports = {
  addCard,
  deleteCard,
  changeCard,
  getCard,
  changeOrder,
  changeTitle,
  permanentDeleteList
};
