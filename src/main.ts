import { init, start } from "./server";
import dotenv from "dotenv";

dotenv.config();

init().then(() => start());