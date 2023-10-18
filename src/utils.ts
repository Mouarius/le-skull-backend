import { v4 } from "uuid";
import { Player } from "./types";

export const randomId = () => {
  return v4();
};

