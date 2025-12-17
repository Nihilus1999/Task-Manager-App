import app from "./app.js";
import { sequelize } from "./database/database.js";
import dotenv from "dotenv";
import "./models/Associations.js";

dotenv.config();

const PORT = process.env.PORT || 4000;

async function main() {
  try {
    await sequelize.sync({ alter: false });
    console.log("Database connected");

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.log("Unable to connect to the database:", error);
  }
}

main();