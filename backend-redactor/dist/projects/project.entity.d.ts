export declare class Project {
    id: number;
    userId: number;
    name: string;
    items: any[];
    metadata?: Record<string, any> | null;
    created_at: Date;
    updated_at: Date;
}
