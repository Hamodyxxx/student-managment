export interface DBStrategy {
    read<T>(collection: string): Promise<T[]>;
    write<T>(collection: string, data: T[]): Promise<void>;
}