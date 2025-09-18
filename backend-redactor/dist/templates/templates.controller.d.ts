export declare class TemplatesController {
    list(): {
        id: string;
        name: string;
        items: {
            id: number;
            type: string;
            text: string;
            x: number;
            y: number;
            fontSize: number;
        }[];
    }[];
}
