const conn = require('../library/conn');

const seedQueries = [

  `INSERT INTO tbl_roles (id, name) VALUES
(1, 'admin'),
(2, 'client');`
  ,
  `INSERT INTO tbl_users (id, email, password, username, bio, created_at, updated_at) VALUES
(1, 'contoh@skibidi.com', '$2b$10$oXa/xBOcSsd1OPfqzJ7ZOOL6sG1klP/7Tw5vWjEbmFqPVZ5saH8s6', 'baguswijaksono', 'Kid namaed bagus', '2024-06-03 09:02:35', '2024-06-03 12:34:13');`
  ,
  `INSERT INTO tbl_system_roles (id, user_id, role_id) VALUES
(1, 1, 1);
`,
  `INSERT INTO tbl_workspace_types (id, name, created_at, updated_at) VALUES
(1, 'Small Business', '2024-05-23 03:38:41', '2024-05-23 03:38:41'),
(2, 'Engineering-IT', '2024-05-23 03:38:41', '2024-05-23 03:38:41'),
(3, 'Operations', '2024-05-23 03:38:41', '2024-05-23 03:38:41'),
(4, 'Marketing', '2024-05-23 03:38:41', '2024-05-23 03:38:41'),
(5, 'Human Resources', '2024-05-23 03:38:41', '2024-05-23 03:38:41'),
(6, 'Eductaion', '2024-05-23 03:38:41', '2024-05-23 03:38:41'),
(7, 'Other', '2024-05-23 03:38:41', '2024-05-23 03:38:41');`
  ,
  `INSERT INTO tbl_workspace_roles (id, name, created_at, updated_at) VALUES
(1, 'owner', '2024-05-23 03:38:41', '2024-05-23 03:38:41'),
(2, 'admin', '2024-05-23 03:38:41', '2024-05-23 03:38:41'),
(3, 'client', '2024-05-23 03:38:41', '2024-05-23 03:38:41');`
  ,
  `INSERT INTO tbl_backgrounds (id, name, created_at, updated_at) VALUES
(1, 'backgrounds 1', '2024-06-03 09:19:25', '2024-06-03 09:19:25');`
  ,
  `INSERT INTO tbl_board_privileges (id, name, created_at, updated_at) VALUES
(1, 'see', '2024-06-03 10:06:08', '2024-06-03 10:06:34'),
(2, 'edit', '2024-06-03 10:06:28', '2024-06-03 10:06:28'),
(3, 'delete', '2024-06-03 10:07:19', '2024-06-03 10:07:19');`
  ,
  `INSERT INTO tbl_board_visibilitys (id, name, created_at, updated_at) VALUES
(1, 'private', '2024-06-03 09:17:50', '2024-06-03 09:18:01'),
(2, 'workspace', '2024-06-03 09:18:10', '2024-06-03 09:18:10');`
  ,
  `INSERT INTO tbl_list_card_archived_status (id, name, created_at, updated_at) VALUES
(1, 'no', '2024-06-03 10:34:27', '2024-06-03 10:34:27'),
(2, 'yes', '2024-06-03 10:34:34', '2024-06-03 10:34:34');`
  ,
  `INSERT INTO tbl_list_card_status (id, name, created_at, updated_at) VALUES
(1, 'not done', '2024-06-03 08:05:38', '2024-06-03 08:05:44'),
(2, 'done', '2024-06-03 08:05:19', '2024-06-03 08:05:31');`

];

const constraintQueries = [
  `ALTER TABLE tbl_boards
  ADD CONSTRAINT tbl_boards_ibfk_1 FOREIGN KEY (owner_id) REFERENCES tbl_users (id),
  ADD CONSTRAINT tbl_boards_ibfk_2 FOREIGN KEY (background) REFERENCES tbl_backgrounds (id),
  ADD CONSTRAINT tbl_boards_ibfk_3 FOREIGN KEY (visibility_id) REFERENCES tbl_board_visibilitys (id),
  ADD CONSTRAINT tbl_boards_ibfk_4 FOREIGN KEY (workspace_id) REFERENCES tbl_workspaces (id);`
  ,
  `ALTER TABLE tbl_collaborators
  ADD CONSTRAINT tbl_collaborators_ibfk_1 FOREIGN KEY (user_id) REFERENCES tbl_users (id),
  ADD CONSTRAINT tbl_collaborators_ibfk_2 FOREIGN KEY (board_id) REFERENCES tbl_boards (id),
  ADD CONSTRAINT tbl_collaborators_ibfk_3 FOREIGN KEY (privilege_id) REFERENCES tbl_board_privileges (id);`
  ,
  `ALTER TABLE tbl_lists
  ADD CONSTRAINT tbl_lists_ibfk_1 FOREIGN KEY (board_id) REFERENCES tbl_boards (id);`
  ,
  `ALTER TABLE tbl_list_cards
  ADD CONSTRAINT tbl_list_cards_ibfk_1 FOREIGN KEY (list_id) REFERENCES tbl_lists (id),
  ADD CONSTRAINT tbl_list_cards_ibfk_2 FOREIGN KEY (archived_status_id) REFERENCES tbl_list_card_archived_status (id);`
  ,
  `ALTER TABLE tbl_list_card_attachments
  ADD CONSTRAINT fk_adder_id69 FOREIGN KEY (adder_id) REFERENCES tbl_users (id),
  ADD CONSTRAINT tbl_list_card_attachments_ibfk_1 FOREIGN KEY (list_card_id) REFERENCES tbl_list_cards (id);`
  ,
  `ALTER TABLE tbl_list_card_checklists
  ADD CONSTRAINT fk_adder_id_12 FOREIGN KEY (adder_id) REFERENCES tbl_users (id),
  ADD CONSTRAINT tbl_list_card_checklists_ibfk_1 FOREIGN KEY (list_card_id) REFERENCES tbl_list_cards (id),
  ADD CONSTRAINT tbl_list_card_checklists_ibfk_2 FOREIGN KEY (status_id) REFERENCES tbl_list_card_status (id);`
  ,
  `ALTER TABLE tbl_list_card_comments
  ADD CONSTRAINT fk_userid FOREIGN KEY (userid) REFERENCES tbl_users (id),
  ADD CONSTRAINT tbl_list_card_comments_ibfk_1 FOREIGN KEY (list_card_id) REFERENCES tbl_list_cards (id);`
  ,
  `ALTER TABLE tbl_list_card_covers
  ADD CONSTRAINT fk_adder_id420 FOREIGN KEY (adder_id) REFERENCES tbl_users (id),
  ADD CONSTRAINT tbl_list_card_covers_ibfk_1 FOREIGN KEY (list_card_id) REFERENCES tbl_list_cards (id);`
  ,
  `ALTER TABLE tbl_list_card_dates
  ADD CONSTRAINT fk_adder_id3 FOREIGN KEY (adder_id) REFERENCES tbl_users (id),
  ADD CONSTRAINT tbl_list_card_dates_ibfk_1 FOREIGN KEY (list_card_id) REFERENCES tbl_list_cards (id);`
  ,
  `ALTER TABLE tbl_list_card_labels
  ADD CONSTRAINT fk_adder_id2 FOREIGN KEY (adder_id) REFERENCES tbl_users (id),
  ADD CONSTRAINT tbl_list_card_labels_ibfk_1 FOREIGN KEY (list_card_id) REFERENCES tbl_list_cards (id);
`,
  `ALTER TABLE tbl_list_card_members
  ADD CONSTRAINT fk_adder_id FOREIGN KEY (adder_id) REFERENCES tbl_users (id),
  ADD CONSTRAINT tbl_list_card_members_ibfk_1 FOREIGN KEY (list_card_id) REFERENCES tbl_list_cards (id),
  ADD CONSTRAINT tbl_list_card_members_ibfk_2 FOREIGN KEY (user_id) REFERENCES tbl_users (id);`
  ,
  `ALTER TABLE tbl_recents_boards
  ADD CONSTRAINT tbl_recents_boards_ibfk_1 FOREIGN KEY (user_id) REFERENCES tbl_users (id),
  ADD CONSTRAINT tbl_recents_boards_ibfk_2 FOREIGN KEY (board_id) REFERENCES tbl_boards (id);`
  ,
  `ALTER TABLE tbl_starred_boards
  ADD CONSTRAINT tbl_starred_boards_ibfk_1 FOREIGN KEY (user_id) REFERENCES tbl_users (id),
  ADD CONSTRAINT tbl_starred_boards_ibfk_2 FOREIGN KEY (board_id) REFERENCES tbl_boards (id);`
  ,
  `ALTER TABLE tbl_system_roles
  ADD CONSTRAINT tbl_system_roles_ibfk_1 FOREIGN KEY (user_id) REFERENCES tbl_users (id),
  ADD CONSTRAINT tbl_system_roles_ibfk_2 FOREIGN KEY (role_id) REFERENCES tbl_roles (id);`
  ,
  `ALTER TABLE tbl_user_activitys
  ADD CONSTRAINT fk_list_card_id FOREIGN KEY (list_card_id) REFERENCES tbl_list_cards (id),
  ADD CONSTRAINT tbl_user_activitys_ibfk_1 FOREIGN KEY (user_id) REFERENCES tbl_users (id),
  ADD CONSTRAINT tbl_user_activitys_ibfk_6 FOREIGN KEY (action_id) REFERENCES tbl_user_action_on_boards (id);`
  ,
  `ALTER TABLE tbl_user_notifications
  ADD CONSTRAINT tbl_user_notifications_ibfk_1 FOREIGN KEY (user_id) REFERENCES tbl_users (id);`
  ,
  `ALTER TABLE tbl_workspaces
  ADD CONSTRAINT tbl_workspaces_ibfk_1 FOREIGN KEY (type_id) REFERENCES tbl_workspace_types (id);`
  ,
  `ALTER TABLE tbl_workspace_invitations
  ADD CONSTRAINT tbl_workspace_invitations_ibfk_1 FOREIGN KEY (invited_user_id) REFERENCES tbl_users (id),
  ADD CONSTRAINT tbl_workspace_invitations_ibfk_2 FOREIGN KEY (inviter_user_id) REFERENCES tbl_users (id),
  ADD CONSTRAINT tbl_workspace_invitations_ibfk_3 FOREIGN KEY (workspace_id) REFERENCES tbl_workspaces (id);`
  ,
  `ALTER TABLE tbl_workspace_members
  ADD CONSTRAINT tbl_workspace_members_ibfk_1 FOREIGN KEY (workspace_id) REFERENCES tbl_workspaces (id),
  ADD CONSTRAINT tbl_workspace_members_ibfk_2 FOREIGN KEY (user_id) REFERENCES tbl_users (id),
  ADD CONSTRAINT tbl_workspace_members_ibfk_3 FOREIGN KEY (role_id) REFERENCES tbl_workspace_roles (id);`


];

const extraQueries = [

  `ALTER TABLE tbl_backgrounds
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;`
  ,
  `ALTER TABLE tbl_boards
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;`
  ,
  `ALTER TABLE tbl_collaborators
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;`
  ,
  `ALTER TABLE tbl_lists
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;`
  ,
  `ALTER TABLE tbl_list_cards
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;`
  ,
  `ALTER TABLE tbl_list_card_attachments
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;`
  ,
  `ALTER TABLE tbl_list_card_checklists
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;`
  ,
  `ALTER TABLE tbl_list_card_comments
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;`
  ,
  `ALTER TABLE tbl_list_card_covers
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;`
  ,
  `ALTER TABLE tbl_list_card_dates
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;`
  ,
  `ALTER TABLE tbl_list_card_labels
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;`
  ,
  `ALTER TABLE tbl_list_card_members
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;`
  ,
  `ALTER TABLE tbl_recents_boards
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;`
  ,
  `ALTER TABLE tbl_roles
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;`
  ,
  `ALTER TABLE tbl_starred_boards
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;`
  ,
  `ALTER TABLE tbl_system_roles
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;`
  ,
  `ALTER TABLE tbl_users
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;`
  ,
  `ALTER TABLE tbl_user_action_on_boards
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;`
  ,
  `ALTER TABLE tbl_user_activitys
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;`
  ,
  `ALTER TABLE tbl_user_notifications
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;`
  ,
  `ALTER TABLE tbl_workspaces
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;
`,
  `ALTER TABLE tbl_workspace_invitations
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;`
  ,
  `ALTER TABLE tbl_workspace_members
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;`
  ,
  `ALTER TABLE tbl_workspace_types
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;`

];

const migrationQueries = [

  `  CREATE TABLE tbl_backgrounds (
    id int(11) NOT NULL,
    name varchar(255) DEFAULT NULL,
    created_at timestamp NOT NULL DEFAULT current_timestamp(),
    updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
  );`
  ,
  `  CREATE TABLE tbl_boards (
    id int(11) NOT NULL,
    owner_id int(11) DEFAULT NULL,
    board_title varchar(255) DEFAULT NULL,
    background int(11) DEFAULT NULL,
    visibility_id int(11) DEFAULT NULL,
    workspace_id int(11) DEFAULT NULL,
    created_at timestamp NOT NULL DEFAULT current_timestamp(),
    updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
  );`
  ,
  `  CREATE TABLE tbl_board_privileges (
    id int(11) NOT NULL,
    name varchar(255) DEFAULT NULL,
    created_at timestamp NOT NULL DEFAULT current_timestamp(),
    updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
  );`
  ,
  `  CREATE TABLE tbl_board_visibilitys (
    id int(11) NOT NULL,
    name varchar(255) DEFAULT NULL,
    created_at timestamp NOT NULL DEFAULT current_timestamp(),
    updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
  );`

  ,
  `  CREATE TABLE tbl_collaborators (
    id int(11) NOT NULL,
    user_id int(11) DEFAULT NULL,
    board_id int(11) DEFAULT NULL,
    privilege_id int(11) DEFAULT NULL,
    created_at timestamp NOT NULL DEFAULT current_timestamp(),
    updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
  );`

  ,
  `  CREATE TABLE tbl_lists (
    id int(11) NOT NULL,
    title varchar(255) DEFAULT NULL,
    board_id int(11) DEFAULT NULL,
    created_at timestamp NOT NULL DEFAULT current_timestamp(),
    updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
  );`

  ,
  `  CREATE TABLE tbl_list_cards (
    id int(11) NOT NULL,
    title varchar(255) DEFAULT NULL,
    list_id int(11) DEFAULT NULL,
    archived_status_id int(11) DEFAULT 1,
    created_at timestamp NOT NULL DEFAULT current_timestamp(),
    updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    description text DEFAULT NULL
  );`

  ,
  `  CREATE TABLE tbl_list_card_archived_status (
    id int(11) NOT NULL,
    name varchar(255) DEFAULT NULL,
    created_at timestamp NOT NULL DEFAULT current_timestamp(),
    updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
  );`
  ,

  `  CREATE TABLE tbl_list_card_attachments (
    id int(11) NOT NULL,
    list_card_id int(11) DEFAULT NULL,
    file_path varchar(255) DEFAULT NULL,
    name varchar(255) NOT NULL,
    adder_id int(11) NOT NULL,
    created_at timestamp NOT NULL DEFAULT current_timestamp(),
    updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
  );`

  ,
  `  CREATE TABLE tbl_list_card_checklists (
    id int(11) NOT NULL,
    list_card_id int(11) DEFAULT NULL,
    title varchar(255) DEFAULT NULL,
    status_id int(11) DEFAULT 1,
    adder_id int(11) NOT NULL,
    created_at timestamp NOT NULL DEFAULT current_timestamp(),
    updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
  );`
  ,
  `  CREATE TABLE tbl_list_card_comments (
    id int(11) NOT NULL,
    list_card_id int(11) DEFAULT NULL,
    comment text DEFAULT NULL,
    created_at timestamp NOT NULL DEFAULT current_timestamp(),
    updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    userid int(11) DEFAULT NULL
  );`
  ,
  `  CREATE TABLE tbl_list_card_covers (
    id int(11) NOT NULL,
    list_card_id int(11) DEFAULT NULL,
    cover varchar(255) DEFAULT NULL,
    adder_id int(11) NOT NULL,
    created_at timestamp NOT NULL DEFAULT current_timestamp(),
    updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
  );`
  ,
  `  CREATE TABLE tbl_list_card_dates (
    id int(11) NOT NULL,
    list_card_id int(11) DEFAULT NULL,
    deadline datetime DEFAULT NULL,
    created_at timestamp NOT NULL DEFAULT current_timestamp(),
    updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    adder_id int(11) DEFAULT NULL
  );`
  ,
  `  CREATE TABLE tbl_list_card_labels (
    id int(11) NOT NULL,
    list_card_id int(11) DEFAULT NULL,
    color varchar(255) DEFAULT NULL,
    title varchar(255) DEFAULT NULL,
    created_at timestamp NOT NULL DEFAULT current_timestamp(),
    updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    adder_id int(11) DEFAULT NULL
  );`
  ,

  `  CREATE TABLE tbl_list_card_members (
    id int(11) NOT NULL,
    list_card_id int(11) DEFAULT NULL,
    user_id int(11) DEFAULT NULL,
    created_at timestamp NOT NULL DEFAULT current_timestamp(),
    updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    adder_id int(11) DEFAULT NULL
  );`
  ,
  `  
  CREATE TABLE tbl_list_card_status (
    id int(11) NOT NULL,
    name varchar(255) DEFAULT NULL,
    created_at timestamp NOT NULL DEFAULT current_timestamp(),
    updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
  );`

  ,
  `  CREATE TABLE tbl_recents_boards (
    id int(11) NOT NULL,
    user_id int(11) DEFAULT NULL,
    board_id int(11) DEFAULT NULL,
    created_at timestamp NOT NULL DEFAULT current_timestamp(),
    updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
  );`

  ,
  `  CREATE TABLE tbl_roles (
    id int(11) NOT NULL,
    name varchar(50) NOT NULL
  );`

  ,
  `  CREATE TABLE tbl_starred_boards (
    id int(11) NOT NULL,
    user_id int(11) DEFAULT NULL,
    board_id int(11) DEFAULT NULL,
    created_at timestamp NOT NULL DEFAULT current_timestamp(),
    updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
  );`
  ,

  `  CREATE TABLE tbl_system_roles (
    id int(11) NOT NULL,
    user_id int(11) NOT NULL,
    role_id int(11) NOT NULL
  );`
  ,
  `  CREATE TABLE tbl_users (
    id int(11) NOT NULL,
    email varchar(255) DEFAULT NULL,
    password varchar(255) DEFAULT NULL,
    username varchar(255) DEFAULT NULL,
    bio text DEFAULT NULL,
    created_at timestamp NOT NULL DEFAULT current_timestamp(),
    updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
  );`
  ,
  `  CREATE TABLE tbl_user_action_on_boards (
    id int(11) NOT NULL,
    name varchar(255) DEFAULT NULL,
    created_at timestamp NOT NULL DEFAULT current_timestamp(),
    updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
  );`

  ,
  `  CREATE TABLE tbl_user_activitys (
    id int(11) NOT NULL,
    user_id int(11) DEFAULT NULL,
    action_id int(11) DEFAULT NULL,
    list_card_id int(11) NOT NULL,
    detailed varchar(255) NOT NULL,
    created_at timestamp NOT NULL DEFAULT current_timestamp(),
    updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
  );`
  ,

  `  CREATE TABLE tbl_user_notifications (
    id int(11) NOT NULL,
    user_id int(11) DEFAULT NULL,
    notification text DEFAULT NULL,
    created_at timestamp NOT NULL DEFAULT current_timestamp(),
    updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
  );`
  ,
  `  CREATE TABLE tbl_workspaces (
    id int(11) NOT NULL,
    name varchar(255) DEFAULT NULL,
    type_id int(11) DEFAULT NULL,
    description varchar(255) DEFAULT NULL,
    created_at timestamp NOT NULL DEFAULT current_timestamp(),
    updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
  );`
  ,
  `  CREATE TABLE tbl_workspace_invitations (
    id int(11) NOT NULL,
    invited_user_id int(11) DEFAULT NULL,
    inviter_user_id int(11) DEFAULT NULL,
    workspace_id int(11) DEFAULT NULL,
    created_at timestamp NOT NULL DEFAULT current_timestamp(),
    updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
  );`
  ,

  `  CREATE TABLE tbl_workspace_members (
    id int(11) NOT NULL,
    workspace_id int(11) DEFAULT NULL,
    user_id int(11) DEFAULT NULL,
    role_id int(11) DEFAULT NULL,
    created_at timestamp NOT NULL DEFAULT current_timestamp(),
    updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
  );`

  ,

  `  CREATE TABLE tbl_workspace_roles (
    id int(11) NOT NULL,
    name varchar(255) DEFAULT NULL,
    created_at timestamp NOT NULL DEFAULT current_timestamp(),
    updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
  );
  `
  ,
  `  CREATE TABLE tbl_workspace_types (
    id int(11) NOT NULL,
    name varchar(255) DEFAULT NULL,
    created_at timestamp NOT NULL DEFAULT current_timestamp(),
    updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
  );`

];

const keyQueries = [
  `  ALTER TABLE tbl_backgrounds
  ADD PRIMARY KEY (id);`
  ,
  `ALTER TABLE tbl_boards
  ADD PRIMARY KEY (id),
  ADD KEY owner_id (owner_id),
  ADD KEY background (background),
  ADD KEY visibility_id (visibility_id),
  ADD KEY workspace_id (workspace_id);`
  ,
  `ALTER TABLE tbl_board_privileges
  ADD PRIMARY KEY (id);`
  ,
  `ALTER TABLE tbl_board_visibilitys
  ADD PRIMARY KEY (id);`
  ,
  `ALTER TABLE tbl_collaborators
  ADD PRIMARY KEY (id),
  ADD KEY user_id (user_id),
  ADD KEY board_id (board_id),
  ADD KEY privilege_id (privilege_id);`
  ,
  `ALTER TABLE tbl_lists
  ADD PRIMARY KEY (id),
  ADD KEY board_id (board_id);`
  ,
  `ALTER TABLE tbl_list_cards
  ADD PRIMARY KEY (id),
  ADD KEY list_id (list_id),
  ADD KEY archived_status_id (archived_status_id);`
  ,
  `ALTER TABLE tbl_list_card_archived_status
  ADD PRIMARY KEY (id);`
  ,
  `ALTER TABLE tbl_list_card_attachments
  ADD PRIMARY KEY (id),
  ADD KEY list_card_id (list_card_id),
  ADD KEY fk_adder_id69 (adder_id);`
  ,
  `ALTER TABLE tbl_list_card_checklists
  ADD PRIMARY KEY (id),
  ADD KEY list_card_id (list_card_id),
  ADD KEY status_id (status_id),
  ADD KEY fk_adder_id_12 (adder_id);`
  ,
  `ALTER TABLE tbl_list_card_comments
  ADD PRIMARY KEY (id),
  ADD KEY list_card_id (list_card_id),
  ADD KEY fk_userid (userid);`
  ,
  `ALTER TABLE tbl_list_card_covers
  ADD PRIMARY KEY (id),
  ADD KEY list_card_id (list_card_id),
  ADD KEY fk_adder_id420 (adder_id);`
  ,
  `ALTER TABLE tbl_list_card_dates
  ADD PRIMARY KEY (id),
  ADD KEY list_card_id (list_card_id),
  ADD KEY fk_adder_id3 (adder_id);`
  ,
  `ALTER TABLE tbl_list_card_labels
  ADD PRIMARY KEY (id),
  ADD KEY list_card_id (list_card_id),
  ADD KEY fk_adder_id2 (adder_id);`
  ,
  `ALTER TABLE tbl_list_card_members
  ADD PRIMARY KEY (id),
  ADD KEY list_card_id (list_card_id),
  ADD KEY user_id (user_id),
  ADD KEY fk_adder_id (adder_id);`
  ,
  `ALTER TABLE tbl_list_card_status
  ADD PRIMARY KEY (id);`
  ,
  `ALTER TABLE tbl_recents_boards
  ADD PRIMARY KEY (id),
  ADD KEY user_id (user_id),
  ADD KEY board_id (board_id);`
  ,
  `ALTER TABLE tbl_roles
  ADD PRIMARY KEY (id);`
  ,
  `ALTER TABLE tbl_starred_boards
  ADD PRIMARY KEY (id),
  ADD KEY user_id (user_id),
  ADD KEY board_id (board_id);`
  ,
  `ALTER TABLE tbl_system_roles
  ADD PRIMARY KEY (id),
  ADD KEY user_id (user_id),
  ADD KEY role_id (role_id);`
  ,
  `ALTER TABLE tbl_users
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY email (email),
  ADD UNIQUE KEY username (username);`
  ,
  `ALTER TABLE tbl_user_action_on_boards
  ADD PRIMARY KEY (id);`
  ,
  `ALTER TABLE tbl_user_activitys
  ADD PRIMARY KEY (id),
  ADD KEY user_id (user_id),
  ADD KEY action_id (action_id),
  ADD KEY fk_list_card_id (list_card_id);`
  ,
  `ALTER TABLE tbl_user_notifications
  ADD PRIMARY KEY (id),
  ADD KEY user_id (user_id);`
  ,
  `ALTER TABLE tbl_workspaces
  ADD PRIMARY KEY (id),
  ADD KEY type_id (type_id);`
  ,
  `ALTER TABLE tbl_workspace_invitations
  ADD PRIMARY KEY (id),
  ADD KEY invited_user_id (invited_user_id),
  ADD KEY inviter_user_id (inviter_user_id),
  ADD KEY workspace_id (workspace_id);`
  ,
  `ALTER TABLE tbl_workspace_members
  ADD PRIMARY KEY (id),
  ADD KEY workspace_id (workspace_id),
  ADD KEY user_id (user_id),
  ADD KEY role_id (role_id);`
  ,
  `ALTER TABLE tbl_workspace_roles
  ADD PRIMARY KEY (id);`
  ,
  `ALTER TABLE tbl_workspace_types
  ADD PRIMARY KEY (id);`
];

function parseArguments(args) {
  const options = {};
  args.forEach((arg, index) => {
    if (arg.startsWith('-')) {
      options[arg] = true;
    }
  });
  return options;
}

const args = process.argv.slice(2);
const options = parseArguments(args);
const QUERY_TYPES = {
  MIGRATION: 'Migration',
  ADD_KEY: 'Add Key',
  ADD_EXTRA: 'Add Extra',
  ADD_CONSTRAINT: 'Add Constraint',
  SEED_DATABASE: 'Seed Database'
};

function executeQuery(conn, query, queryType, tableNameExtractor) {
  return new Promise((resolve, reject) => {
    conn.query(query, (err) => {
      if (err) {
        console.error(`Error running ${queryType} query:`, err);
        return reject(err);
      }
      const tableNameMatch = query.match(tableNameExtractor);
      const tableName = tableNameMatch ? tableNameMatch[1] : 'Unknown table';
      console.log(`${queryType} query executed successfully for table: ${tableName}`);
      resolve();
    });
  });
}

async function executeQueries(conn, queries, queryType, tableNameExtractor) {
  for (let index = 0; index < queries.length; index++) {
    const query = queries[index];
    try {
      await executeQuery(conn, query, queryType, tableNameExtractor);
    } catch (err) {
      console.error(`Failed to execute ${queryType} query at index ${index}:`, err);
      throw err;
    }
  }
}

async function executeMigrations(conn) {
  try {
    await executeQueries(conn, migrationQueries, QUERY_TYPES.MIGRATION, /CREATE TABLE (\w+)/i);
    await executeQueries(conn, keyQueries, QUERY_TYPES.ADD_KEY, /ALTER TABLE (\w+)/i);
    await executeQueries(conn, extraQueries, QUERY_TYPES.ADD_EXTRA, /ALTER TABLE (\w+)/i);
    await executeQueries(conn, constraintQueries, QUERY_TYPES.ADD_CONSTRAINT, /ALTER TABLE (\w+)/i);
  } catch (err) {
    console.error('Migration failed:', err);
  }
}

async function executeSeedDatabase(conn) {
  try {
    await executeQueries(conn, seedQueries, QUERY_TYPES.SEED_DATABASE, /INSERT INTO (\w+)/i);
  } catch (err) {
    console.error('Seed Database failed:', err);
  }
}

async function run() {
  if (options['-migrate']) {
    await executeMigrations(conn);
  } else if (options['-seed']) {
    await executeSeedDatabase(conn);
  } else {
    console.log('No valid option provided. Use -migrate or -seed.');
  }

  conn.end((err) => {
    if (err) {
      console.error('Error closing MySQL connection:', err);
      return;
    }
    console.log('MySQL connection closed');
  });
}

run();
