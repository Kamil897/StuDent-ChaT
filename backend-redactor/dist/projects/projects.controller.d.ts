import { Repository } from 'typeorm';
import { Project } from './project.entity';
export declare class ProjectsController {
    private readonly projects;
    constructor(projects: Repository<Project>);
    list(req: any): Promise<Project[]>;
    save(req: any, body: {
        id?: number;
        name: string;
        items: any[];
        metadata?: any;
    }): Promise<{
        project: Project;
    }>;
}
