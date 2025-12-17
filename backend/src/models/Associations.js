import { User } from "./User.js";
import { Task } from "./Task.js";

User.hasMany(Task, { foreignKey: "user_id" });
Task.belongsTo(User, { foreignKey: "user_id" });

export { User, Task };
