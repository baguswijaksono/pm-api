const express = require("express");
const userRoutes = require("./routes/UserRoutes");
const boardRoutes = require("./routes/BoardRoutes");
const workspaceRoutes = require("./routes/WorkspaceRoutes");
const listRoutes = require("./routes/ListRoutes");
const cardRoutes = require("./routes/CardRoutes");
const cors = require("cors");

const app = express();
let corsOptions = {
  origin: ["http://localhost:3001"],
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));

app.use("/users", userRoutes);
app.use("/boards", boardRoutes);
app.use("/workspace", workspaceRoutes);
app.use("/list", listRoutes);
app.use("/card", cardRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} in http://localhost:${PORT}`);
});
