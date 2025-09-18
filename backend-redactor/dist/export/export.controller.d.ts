import { Response } from 'express';
export declare class ExportController {
    exportPng(dataUrl: string, res: Response): Promise<Response<any, Record<string, any>>>;
    exportSvg(svg: string, res: Response): Promise<Response<any, Record<string, any>>>;
}
