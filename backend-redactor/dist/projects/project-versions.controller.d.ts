import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { ProjectVersion } from './project-version.entity';
export declare class ProjectVersionsController {
    private readonly projects;
    private readonly versions;
    constructor(projects: Repository<Project>, versions: Repository<ProjectVersion>);
    list(req: any, id: number): Promise<ProjectVersion[]>;
    restore(req: any, id: number, versionId: number): Promise<{
        project: Project;
    }>;
}
