const conn = require('../library/conn');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const getAllUser = (req, res) => {
  const query = `
    SELECT id, email,username,bio, created_at,updated_at FROM tbl_users;
  `;

  conn.query(query, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).json(results);
  });
};

const getUserWorkspace = (req, res) => {
  const user_id = req.userId;
  const query = `
    SELECT 
      wm.id AS membership_id,
      wm.workspace_id,
      wm.role_id,
      ws.name AS workspace_name,
      ws.type_id,
      wt.name AS workspace_type,
      r.name AS role_name,
      wm.created_at AS membership_created_at,
      wm.updated_at AS membership_updated_at,
      (SELECT COUNT(*) FROM tbl_workspace_members WHERE workspace_id = wm.workspace_id) AS member_count
    FROM 
      tbl_workspace_members wm
    JOIN 
      tbl_workspaces ws ON wm.workspace_id = ws.id
    JOIN 
      tbl_workspace_roles r ON wm.role_id = r.id
    JOIN 
      tbl_workspace_types wt ON ws.type_id = wt.id
    JOIN 
      tbl_users u ON wm.user_id = u.id
    WHERE 
      wm.user_id = ?;
  `;

  conn.query(query, [user_id], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }

    if (results.length === 0) {
      return res.status(200).json([]);
    }
    const promises = results.map(workspace => {
      const recentBoardQuery = `
        SELECT 
          b.*,
          CASE WHEN sb.board_id IS NOT NULL THEN 1 ELSE 0 END AS is_starred
        FROM 
          tbl_recents_boards rb
        JOIN 
          tbl_boards b ON rb.board_id = b.id
        LEFT JOIN 
          tbl_starred_boards sb ON b.id = sb.board_id AND sb.user_id = ?
        WHERE 
          b.workspace_id = ? AND rb.user_id = ?
        ORDER BY 
          rb.updated_at DESC
        LIMIT 3;
      `;

      return new Promise((resolve, reject) => {
        conn.query(recentBoardQuery, [user_id, workspace.workspace_id, user_id], (err, boardResults) => {
          if (err) {
            return reject(err);
          }

          workspace.recent_boards = boardResults;
          resolve(workspace);
        });
      });
    });

    Promise.all(promises)
      .then(workspaces => res.status(200).json(workspaces))
      .catch(error => res.status(500).send(error));
  });
};


const getUserBoard = (req, res) => {
  const user_id = req.userId;
  const query = `
  SELECT 
    b.id AS board_id,
    b.board_title,
    b.background,
    bg.name AS background_name,
    b.visibility_id,
    bv.name AS board_visibility,
    b.workspace_id,
    ws.name AS workspace_name,
    b.owner_id,
    c.privilege_id,
    bp.name AS privilege_name,
    b.created_at AS board_created_at,
    b.updated_at AS board_updated_at
FROM 
    tbl_boards b
LEFT JOIN 
    tbl_backgrounds bg ON b.background = bg.id
LEFT JOIN 
    tbl_board_visibilitys bv ON b.visibility_id = bv.id
LEFT JOIN 
    tbl_workspaces ws ON b.workspace_id = ws.id
LEFT JOIN 
    tbl_users u ON b.owner_id = u.id
LEFT JOIN 
    tbl_collaborators c ON b.id = c.board_id
LEFT JOIN 
    tbl_users cu ON c.user_id = cu.id
LEFT JOIN 
    tbl_board_privileges bp ON c.privilege_id = bp.id
WHERE 
    b.owner_id = ? OR b.id IN (
        SELECT board_id 
        FROM tbl_collaborators 
        WHERE user_id = ?
    );
  `;

  conn.query(query, [user_id, user_id], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).json(results);
  });
};

const getStarredBoard = (req, res) => {
  const user_id = req.userId;
  const query = `
    SELECT 
      b.id AS board_id, 
      b.board_title, 
      b.workspace_id, 
      w.name AS workspace_name
    FROM 
      tbl_starred_boards sb
    JOIN 
      tbl_boards b ON sb.board_id = b.id
    JOIN 
      tbl_workspaces w ON b.workspace_id = w.id
    WHERE 
      sb.user_id = ?
    ORDER BY 
      sb.updated_at DESC;
  `;

  conn.query(query, [user_id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).json(result);
  });
};

const getInvite = (req, res) => {
  const user_id = req.userId;

  const query = `
  SELECT 
  wi.id AS invitation_id,
  wi.inviter_user_id,
  i.username AS inviter_user_name,
  wi.workspace_id,
  ws.name AS workspace_name,
  ws.type_id,
  wt.name AS workspace_type,
  wi.created_at AS invitation_created_at,
  wi.updated_at AS invitation_updated_at
FROM 
  tbl_workspace_invitations wi
JOIN 
  tbl_users iu ON wi.invited_user_id = iu.id
JOIN 
  tbl_users i ON wi.inviter_user_id = i.id
JOIN 
  tbl_workspaces ws ON wi.workspace_id = ws.id
JOIN 
  tbl_workspace_types wt ON ws.type_id = wt.id
WHERE 
  wi.invited_user_id = ?; 
  `;

  conn.query(query, [user_id], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).json(results);
  });
};

const getUserById = (req, res) => {
  const user_id = req.userId;
  conn.query(`
  SELECT 
    u.id AS user_id,
    u.email,
    u.username,
    u.bio,
    u.created_at AS user_created_at,
    u.updated_at AS user_updated_at,
    sr.role_id,
    r.name AS role_name
FROM 
    tbl_users u
LEFT JOIN 
    tbl_system_roles sr ON u.id = sr.user_id
LEFT JOIN 
    tbl_roles r ON sr.role_id = r.id
WHERE 
    u.id = ?;
  `, [user_id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.length === 0) {
      return res.status(404).send('User not found');
    }
    res.status(200).json(result[0]);
  });
};

const loginUser = (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT id, password FROM tbl_users WHERE email = ?';
  conn.query(query, [email], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database query error', error: err });
    }
    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const user = results[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ message: 'Password comparison error', error: err });
      }
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const accessToken = jwt.sign({ userId: user.id, email: email }, process.env.JWT_SECRET, { expiresIn: '12h' });

      res.json({ accessToken, userId: user.id });
    });
  });
};

const getUserNotification = (req, res) => {
  const query = `SELECT * FROM tbl_user_notifications WHERE user_id = ?`;

  conn.query(query, [req.userId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.status(200).json(result);
  });
};

const deleteUserNotification = (req, res) => {
  const query = `DELETE FROM tbl_user_notifications WHERE user_id = ?`;

  conn.query(query, [req.userId], (err, result) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'No notifications found for the given user.' });
    }

    res.status(200).json({ message: 'Notifications deleted successfully.' });
  });
};

const getUserActivity = (req, res) => {
  const query = `
  SELECT 
    ua.id,
    ua.action_id,
    a.name AS action_name,
    ua.list_card_id,
    lc.title AS list_card_title,
    ua.detailed,
    ua.created_at,
    ua.updated_at
  FROM 
    tbl_user_activitys ua
  JOIN 
    tbl_user_action_on_boards a ON ua.action_id = a.id
  JOIN
    tbl_list_cards lc ON ua.list_card_id = lc.id
  WHERE 
    ua.user_id = ?
  ORDER BY 
    ua.created_at DESC;
  `;

  conn.query(query, req.userId, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).json(result);
  });
};


const addUserActivity = (user_id, action_id, list_card_id, detailed) => {
  const sql = `
    INSERT INTO tbl_user_activitys (id, user_id, action_id, list_card_id, detailed)
    VALUES (NULL, ?, ?, ?, ?);
  `;

  conn.query(sql, [user_id, action_id, list_card_id, detailed], (err, results) => {
    if (err) {
      console.error('Error inserting user activity:', err);
      return;
    }
  });
};

const getRecentBoard = (req, res) => {
  const user_id = req.userId;
  const query = `
    SELECT 
      b.id AS board_id, 
      b.board_title, 
      b.workspace_id, 
      w.name AS workspace_name,
      (SELECT 
          IF(COUNT(*) > 0, 1, 0) 
        FROM 
          tbl_starred_boards sb 
        WHERE 
          sb.user_id = ? AND sb.board_id = b.id
      ) AS is_starred
    FROM 
      tbl_recents_boards rb
    JOIN 
      tbl_boards b ON rb.board_id = b.id
    JOIN 
      tbl_workspaces w ON b.workspace_id = w.id
    WHERE 
      rb.user_id = ?
    ORDER BY 
      rb.updated_at DESC;
  `;

  conn.query(query, [user_id, user_id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).json(result);
  });
};


const createUser = async (req, res) => {
  const { email, password, username } = req.body;

  const checkUserQuery = 'SELECT email FROM tbl_users WHERE email = ?';
  conn.query(checkUserQuery, [email], async (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database query error', error: err });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const query = 'INSERT INTO tbl_users (email, password, username) VALUES (?, ?, ?)';
      conn.query(query, [email, hashedPassword, username], (err, result) => {
        if (err) {
          return res.status(500).json({ message: 'Database insert error', error: err });
        }
        res.status(201).json({ message: `User added with ID: ${result.insertId}` });
      });
    } catch (hashError) {
      return res.status(500).json({ message: 'Password hashing error', error: hashError });
    }
  });
};

const removeStar = (req, res) => {
  const { board_id } = req.params;

  const query = `
    DELETE FROM tbl_starred_boards
    WHERE user_id = ? AND board_id = ?
  `;

  conn.query(query, [req.userId, board_id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Star not found' });
    }
    res.status(200).json({ message: 'Star removed successfully' });
  });
};

const refuseInvitation = (req, res) => {
  const { invitation_id } = req.params;

  const checkQuery = `
    SELECT * FROM tbl_workspace_invitations
    WHERE id = ?;
  `;

  conn.query(checkQuery, [invitation_id], (checkErr, checkResult) => {
    if (checkErr) {
      return res.status(500).send(checkErr);
    }
    if (checkResult.length === 0) {
      return res.status(404).json({ message: 'Invitation not found or does not belong to the user' });
    }

    const deleteQuery = `
      DELETE FROM tbl_workspace_invitations
      WHERE id = ?;
    `;

    conn.query(deleteQuery, [invitation_id], (deleteErr) => {
      if (deleteErr) {
        return res.status(500).send(deleteErr);
      }
      res.status(200).json({ message: 'Invitation refused successfully' });
    });
  });
};

const changePassword = async (req, res) => {
  const user_id = req.userId;
  const { old_password, new_password } = req.body;

  if (!user_id || !old_password || !new_password) {
    return res.status(400).json({ message: 'User ID, old password, and new password are required' });
  }

  const getPasswordQuery = 'SELECT password FROM tbl_users WHERE id = ?';
  conn.query(getPasswordQuery, [user_id], async (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database query error', error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const currentHashedPassword = results[0].password;

    const isPasswordMatch = await bcrypt.compare(old_password, currentHashedPassword);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }

    try {
      const newHashedPassword = await bcrypt.hash(new_password, 10);
      const updateQuery = 'UPDATE tbl_users SET password = ? WHERE id = ?';
      conn.query(updateQuery, [newHashedPassword, user_id], (err, result) => {
        if (err) {
          return res.status(500).json({ message: 'Database update error', error: err });
        }
        res.status(200).json({ message: 'Password updated successfully' });
      });
    } catch (hashError) {
      return res.status(500).json({ message: 'Password hashing error', error: hashError });
    }
  });
};

const changeUsername = (req, res) => {
  const user_id = req.userId;
  const { username } = req.body;

  const query = `
    UPDATE tbl_users
    SET username = ?
    WHERE id = ?;
  `;

  conn.query(query, [username, user_id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'Username updated successfully' });
  });
};

const changeEmail = (req, res) => {
  const user_id = req.userId;
  const { email } = req.body;

  const query = `
    UPDATE tbl_users
    SET email = ?
    WHERE id = ?;
  `;

  conn.query(query, [email, user_id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'Email updated successfully' });
  });
};

const changeBio = (req, res) => {
  const user_id = req.userId;
  const { bio } = req.body;

  const query = `
    UPDATE tbl_users
    SET bio = ?
    WHERE id = ?;
  `;

  conn.query(query, [bio, user_id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'Bio updated successfully' });
  });
};

module.exports = {
  getRecentBoard, getStarredBoard, getInvite, getUserBoard, getUserWorkspace, getUserById,
  createUser,
  changePassword,
  loginUser,
  getUserNotification,
  getUserActivity,
  removeStar,
  changeEmail,
  changeUsername,
  deleteUserNotification,
  changeBio,
  refuseInvitation,
  addUserActivity,
  getAllUser
};
