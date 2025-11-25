import fs from "fs/promises";
import path from "path";
import { DBStrategy } from "../types/DBStrategy";

export class FileStrategy implements DBStrategy {
  constructor(private basePath: string = "./db") {}

  private file(collection: string) {
    return path.join(this.basePath, `${collection}.json`);
  }

  async read<T>(collection: string): Promise<T[]> {
    try {
      const raw = await fs.readFile(this.file(collection), "utf-8");
      const parsed = JSON.parse(raw);
      return parsed.map((x: any) => {
        if (x.createdAt) x.createdAt = new Date(x.createdAt);
        if (x.updatedAt) x.updatedAt = new Date(x.updatedAt);
        return x;
      });
    } catch {
      return [];
    }
  }

  async write<T>(collection: string, data: T[]): Promise<void> {
    await fs.mkdir(this.basePath, { recursive: true });
    await fs.writeFile(this.file(collection), JSON.stringify(data, null, 2));
  }
}
