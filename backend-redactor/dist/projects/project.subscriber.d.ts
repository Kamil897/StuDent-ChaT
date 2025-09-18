import { DataSource, EntitySubscriberInterface, InsertEvent, UpdateEvent } from 'typeorm';
import { Project } from './project.entity';
export declare class ProjectSubscriber implements EntitySubscriberInterface<Project> {
    constructor(dataSource: DataSource);
    private readonly dataSource;
    listenTo(): typeof Project;
    afterInsert(event: InsertEvent<Project>): Promise<void>;
    afterUpdate(event: UpdateEvent<Project>): Promise<void>;
    private createVersion;
}
