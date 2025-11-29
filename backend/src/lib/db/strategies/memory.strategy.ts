import { DBStrategy } from "../types/DBStrategy";


export class InMemoryStrategy implements DBStrategy {
  private store = new Map<string, any[]>();

  async read<T>(collection: string): Promise<T[]> {
    return this.store.get(collection) ?? [];
  }

  async write<T>(collection: string, data: T[]): Promise<void> {
    this.store.set(collection, data);
  }
}
