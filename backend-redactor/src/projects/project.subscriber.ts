import { DataSource, EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';
import { Project } from './project.entity';
import { ProjectVersion } from './project-version.entity';

@EventSubscriber()
export class ProjectSubscriber implements EntitySubscriberInterface<Project> {
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
    this.dataSource = dataSource;
  }

  private readonly dataSource: DataSource;

  listenTo() {
    return Project;
  }

  async afterInsert(event: InsertEvent<Project>) {
    await this.createVersion(event.entity);
  }

  async afterUpdate(event: UpdateEvent<Project>) {
    if (event.entity) {
      await this.createVersion(event.entity as Project);
    }
  }

  private async createVersion(project: Project) {
    const repo = this.dataSource.getRepository(ProjectVersion);
    const version = repo.create({ projectId: project.id, userId: project.userId, items: project.items || [] });
    await repo.save(version);
  }
}

