const conn = require('../library/conn');

const GrantCollaboratorEdit = (req, res) => {
  const { board_id, user_id } = req.params;
  const query = `
    UPDATE tbl_collaborators
    SET privilege_id = 2
    WHERE board_id = ? AND user_id = ?;
  `;

  conn.query(query, [board_id, user_id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.affectedRows === 0) {
      return res.status(404).send('Collaborator not found or no update needed');
    }
    res.status(200).json({ message: 'Collaborator privilege updated successfully' });
  });
};

const getBoardById = (req, res) => {
  const { board_id } = req.params;
  const user_id = req.userId; 

  const checkExistenceQuery = `
    SELECT \`id\` FROM \`tbl_recents_boards\` 
    WHERE \`user_id\` = ? AND \`board_id\` = ?
  `;

  const updateTimestampQuery = `
    UPDATE \`tbl_recents_boards\` 
    SET \`updated_at\` = current_timestamp() 
    WHERE \`id\` = ?
  `;

  const insertQuery = `
    INSERT INTO \`tbl_recents_boards\` (\`user_id\`, \`board_id\`, \`created_at\`, \`updated_at\`) 
    VALUES (?, ?, current_timestamp(), current_timestamp())
  `;

  const countQuery = `
    SELECT COUNT(*) as count FROM \`tbl_recents_boards\` 
    WHERE \`user_id\` = ?
  `;

  const deleteOldestQuery = `
    DELETE FROM \`tbl_recents_boards\` 
    WHERE \`id\` = (
      SELECT \`id\` FROM \`tbl_recents_boards\` 
      WHERE \`user_id\` = ? 
      ORDER BY \`created_at\` ASC 
      LIMIT 1
    )
  `;

  const fetchBoardDetails = (board_id, user_id, res) => {
    const query = `
      SELECT
          b.*,
          u.username AS owner_username,
          bv.name AS visibility_name,
          bg.name AS background_name,
          w.name AS workspace_name,
          CASE WHEN s.user_id IS NULL THEN FALSE ELSE TRUE END AS is_starred,
          c.privilege_id AS board_privilege,
          CASE 
              WHEN c.privilege_id = 1 THEN 'see' 
              WHEN c.privilege_id = 2 THEN 'edit' 
              WHEN c.privilege_id = 3 THEN 'delete' 
              ELSE NULL 
          END AS privilege_name
      FROM
          tbl_boards b
          LEFT JOIN tbl_users u ON b.owner_id = u.id
          LEFT JOIN tbl_board_visibilitys bv ON b.visibility_id = bv.id
          LEFT JOIN tbl_backgrounds bg ON b.background = bg.id
          LEFT JOIN tbl_workspaces w ON b.workspace_id = w.id
          LEFT JOIN tbl_starred_boards s ON b.id = s.board_id AND s.user_id = ?
          LEFT JOIN tbl_collaborators c ON b.id = c.board_id AND c.user_id = ?
      WHERE
          b.id = ?;
    `;
  
    conn.query(query, [user_id, user_id, board_id], (err, result) => {
      if (err) {
        return res.status(500).send({ error: 'Internal Server Error', details: err });
      }
      if (result.length === 0) {
        return res.status(404).send({ error: 'Board not found' });
      }
      res.status(200).send(result[0]);
    });
  };
  

  conn.query(checkExistenceQuery, [user_id, board_id], (err, existenceResult) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (existenceResult.length === 0) {
      conn.query(insertQuery, [user_id, board_id], (err, insertResult) => {
        if (err) {
          return res.status(500).send(err);
        }
        conn.query(countQuery, [user_id], (err, countResult) => {
          if (err) {
            return res.status(500).send(err);
          }
          if (countResult[0].count > 7) {
            conn.query(deleteOldestQuery, [user_id], (err, deleteResult) => {
              if (err) {
                return res.status(500).send(err);
              }
              fetchBoardDetails(board_id, user_id, res);
            });
          } else {
            fetchBoardDetails(board_id, user_id, res);
          }
        });
      });
    } else {
      conn.query(updateTimestampQuery, [existenceResult[0].id], (err, updateResult) => {
        if (err) {
          return res.status(500).send(err);
        }
        fetchBoardDetails(board_id, user_id, res);
      });
    }
  });
};


const fetchBoardDetails = (board_id, res) => {
  const query = `
    SELECT
      b.*,
      u.username AS owner_username,
      bv.name AS visibility_name,
      bg.name AS background_name,
      w.name AS workspace_name
    FROM
      tbl_boards b
      LEFT JOIN tbl_users u ON b.owner_id = u.id
      LEFT JOIN tbl_board_visibilitys bv ON b.visibility_id = bv.id
      LEFT JOIN tbl_backgrounds bg ON b.background = bg.id
      LEFT JOIN tbl_workspaces w ON b.workspace_id = w.id
    WHERE
      b.id = ?;
  `;

  conn.query(query, [board_id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.length === 0) {
      return res.status(404).send('Board not found');
    }
    res.status(200).send(result);
  });
};

const getCollaborator = (req, res) => {
  const { board_id } = req.params;

  const query = `
  SELECT 
  c.id AS collaborator_id,
  c.user_id,
  u.username AS user_username,
  u.email AS user_email,
  c.privilege_id,
  bp.name AS privilege_name,
  c.created_at AS collaborator_created_at,
  c.updated_at AS collaborator_updated_at
FROM 
  tbl_collaborators c
LEFT JOIN 
  tbl_users u ON c.user_id = u.id
LEFT JOIN 
  tbl_board_privileges bp ON c.privilege_id = bp.id
WHERE 
  c.board_id = ?;
  `;

  conn.query(query, [board_id], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).json(results);
  });
};

const getList = (req, res) => {
  const { board_id } = req.params;

  const query = `
    SELECT * FROM tbl_lists
    WHERE board_id = ?;
  `;

  conn.query(query, [board_id], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).json(results);
  });
};

const updateBoard = (req, res) => {
  const { board_id } = req.params;
  const { board_title, visibility, background } = req.body;
  const query = 'UPDATE `tbl_boards` SET `board_title` = ?, `visibility_id` = ?, `background` = ? WHERE `id` = ?';

  conn.query(query, [board_title, visibility, background, board_id], (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).send(`Board updated with ID: ${board_id}`);
  });
};

const addCollaborator = (req, res) => {
  const { board_id } = req.params;
  const { user_id, privilege_id } = req.body;

  const checkQuery = 'SELECT COUNT(*) AS count FROM `tbl_collaborators` WHERE `user_id` = ? AND `board_id` = ?;';
  conn.query(checkQuery, [user_id, board_id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (result[0].count > 0) {
      return res.status(400).json({ error: `User ${user_id} is already a collaborator for board ${board_id}` });
    }

    const insertQuery = 'INSERT INTO `tbl_collaborators` (`user_id`, `board_id`, `privilege_id`) VALUES (?, ?, ?);';
    conn.query(insertQuery, [user_id, board_id, privilege_id], (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json({ message: `Successfully added collaborator to board ID: ${board_id}` });
    });
  });
};


const deleteBoard = (req, res) => {
  const { board_id } = req.params;

  const queries = [
    { sql: 'DELETE FROM tbl_list_card_attachments WHERE list_card_id IN (SELECT id FROM tbl_list_cards WHERE list_id IN (SELECT id FROM tbl_lists WHERE board_id = ?))', values: [board_id] },
    { sql: 'DELETE FROM tbl_list_card_checklists WHERE list_card_id IN (SELECT id FROM tbl_list_cards WHERE list_id IN (SELECT id FROM tbl_lists WHERE board_id = ?))', values: [board_id] },
    { sql: 'DELETE FROM tbl_list_card_comments WHERE list_card_id IN (SELECT id FROM tbl_list_cards WHERE list_id IN (SELECT id FROM tbl_lists WHERE board_id = ?))', values: [board_id] },
    { sql: 'DELETE FROM tbl_list_card_covers WHERE list_card_id IN (SELECT id FROM tbl_list_cards WHERE list_id IN (SELECT id FROM tbl_lists WHERE board_id = ?))', values: [board_id] },
    { sql: 'DELETE FROM tbl_list_card_dates WHERE list_card_id IN (SELECT id FROM tbl_list_cards WHERE list_id IN (SELECT id FROM tbl_lists WHERE board_id = ?))', values: [board_id] },
    { sql: 'DELETE FROM tbl_list_card_labels WHERE list_card_id IN (SELECT id FROM tbl_list_cards WHERE list_id IN (SELECT id FROM tbl_lists WHERE board_id = ?))', values: [board_id] },
    { sql: 'DELETE FROM tbl_list_card_members WHERE list_card_id IN (SELECT id FROM tbl_list_cards WHERE list_id IN (SELECT id FROM tbl_lists WHERE board_id = ?))', values: [board_id] },
    { sql: 'DELETE FROM tbl_user_activitys WHERE list_card_id IN (SELECT id FROM tbl_list_cards WHERE list_id IN (SELECT id FROM tbl_lists WHERE board_id = ?))', values: [board_id] },
    { sql: 'DELETE FROM tbl_list_cards WHERE list_id IN (SELECT id FROM tbl_lists WHERE board_id = ?)', values: [board_id] },
    { sql: 'DELETE FROM tbl_lists WHERE board_id = ?', values: [board_id] },
    { sql: 'DELETE FROM tbl_collaborators WHERE board_id = ?', values: [board_id] },
    { sql: 'DELETE FROM tbl_recents_boards WHERE board_id = ?', values: [board_id] },
    { sql: 'DELETE FROM tbl_starred_boards WHERE board_id = ?', values: [board_id] },
    { sql: 'DELETE FROM tbl_boards WHERE id = ?', values: [board_id] }
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
          res.status(200).json({ message: 'Board and related data deleted successfully' });
        });
      }
    };

    executeQuery(0);
  });
};



const starBoard = (req, res) => {
  const { board_id } = req.body;
  const checkQuery = `
    SELECT * FROM tbl_starred_boards 
    WHERE user_id = ? AND board_id = ?;
  `;

  conn.query(checkQuery, [req.userId, board_id], (checkErr, checkResult) => {
    if (checkErr) {
      return res.status(500).send(checkErr);
    }

    if (checkResult.length > 0) {
      return res.status(409).json({ message: 'Board already starred' });
    }

    const insertQuery = `
      INSERT INTO tbl_starred_boards (user_id, board_id)
      VALUES (?, ?);
    `;

    conn.query(insertQuery, [req.userId, board_id], (insertErr, result) => {
      if (insertErr) {
        return res.status(500).send(insertErr);
      }
      res.status(201).json({ message: 'Board starred successfully', insertId: result.insertId });
    });
  });
};

const changeBoardTitle = (req, res) => {
  const { board_id } = req.params;
  const { board_title } = req.body;

  const query = `
    UPDATE tbl_boards
    SET board_title = ?
    WHERE id = ?;
  `;

  conn.query(query, [board_title, board_id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Board not found' });
    }
    res.status(200).json({ message: 'Board title updated successfully' });
  });
};

const getBoardVisibility = (req, res) => {
  const query = `
    SELECT * FROM tbl_board_visibilitys;
  `;

  conn.query(query, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).json(results);
  });
};

const getBoardPrivilege = (req, res) => {
  const query = `
    SELECT * FROM tbl_board_privileges;
  `;

  conn.query(query, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).json(results);
  });
};

const addList = (req, res) => {
  const { title } = req.body;
  const { board_id } = req.params;

  const insertQuery = `
    INSERT INTO tbl_lists (title, board_id)
    VALUES (?, ?);
  `;

  conn.query(insertQuery, [title, board_id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: 'List added successfully', insertId: result.insertId });
  });
};


module.exports = {
  getCollaborator,
  getList,
  addList,
  getBoardById,
  updateBoard,
  deleteBoard,
  starBoard,
  getBoardVisibility,
  getBoardPrivilege,
  changeBoardTitle,
  GrantCollaboratorEdit,
  addCollaborator
};
