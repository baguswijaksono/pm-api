const conn = require('../library/conn');

const getUser = (req, res) => {
    const query = `
      SELECT * FROM tbl_users;
    `;

    conn.query(query, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json(results);
    });
};

const getWorkspace = (req, res) => {
    const query = 'SELECT * FROM `tbl_workspaces`;';

    conn.query(query, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json(results);
    });
};

const getBoard = (req, res) => {
    const query = 'SELECT * FROM `tbl_boards`;';

    conn.query(query, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json(results);
    });
};

const addBackground = (req, res) => {
    const { name } = req.body;

    const query = `
      INSERT INTO tbl_backgrounds (name)
      VALUES (?);
    `;

    conn.query(query, [name], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(201).json({ message: 'Background added successfully', insertId: result.insertId });
    });
};

const changeBackground = (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    const query = `
      UPDATE tbl_backgrounds
      SET name = ?
      WHERE id = ?;
    `;

    conn.query(query, [name, id], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Background not found' });
        }
        res.status(200).json({ message: 'Background updated successfully' });
    });
};

const deleteBackground = (req, res) => {
    const { id } = req.params;

    const query = `
      DELETE FROM tbl_backgrounds
      WHERE id = ?;
    `;

    conn.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Background not found' });
        }
        res.status(200).json({ message: 'Background deleted successfully' });
    });
};

const addWorkspaceType = (req, res) => {
    const { name } = req.body;

    const query = `
      INSERT INTO tbl_workspace_types (name)
      VALUES (?);
    `;

    conn.query(query, [name], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(201).json({ message: 'Workspace type added successfully', insertId: result.insertId });
    });
};

const changeWorkspaceType = (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    const query = `
      UPDATE tbl_workspace_types
      SET name = ?
      WHERE id = ?;
    `;

    conn.query(query, [name, id], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Workspace type not found' });
        }
        res.status(200).json({ message: 'Workspace type updated successfully' });
    });
};

const deleteWorkspaceType = (req, res) => {
    const { id } = req.params;

    const query = `
      DELETE FROM tbl_workspace_types
      WHERE id = ?;
    `;

    conn.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Workspace type not found' });
        }
        res.status(200).json({ message: 'Workspace type deleted successfully' });
    });
};


module.exports = {
    getUser,
    getWorkspace, getBoard,
    addWorkspaceType,
    addBackground,
    changeBackground,
    deleteBackground,
    changeWorkspaceType,
    deleteWorkspaceType
};
