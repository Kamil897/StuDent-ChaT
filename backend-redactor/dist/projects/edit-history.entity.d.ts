export declare class EditHistory {
    id: number;
    projectId: number;
    userId: number;
    action: string;
    payload?: Record<string, any> | null;
    created_at: Date;
}
