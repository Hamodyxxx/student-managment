import {Database} from "../../lib/db/database.js";
import { FileStrategy } from "../../lib/db/strategies/file.strategy.js";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const basePath = join(__dirname, "database");

const db = new Database(new FileStrategy(basePath));

export { db };