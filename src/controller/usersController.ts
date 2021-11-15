import users from "../database/users";
import { v4 as uuidv4 } from "uuid";
import { User } from "../config/types";

const usersController = {
  getAll: () => {
    return users;
  },
  getOne: (id: string) => {
    return users.find((user) => user.id === id);
  },
  create: (username: string) => {
    const id = uuidv4();
    const newUser: User = {
      username,
      id,
    };
    users.push(newUser);
    return newUser;
  },
  delete: (id: string) => {
    const userIndex = users.findIndex((user) => user.id === id);
    users.splice(userIndex, 1);
  },
};

export default usersController;
