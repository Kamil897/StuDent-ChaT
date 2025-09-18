import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class ProjectVersion {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int' })
  projectId!: number;

  @Column({ type: 'int' })
  userId!: number;

  @Column({ type: 'json' })
  items!: any[];

  @CreateDateColumn()
  created_at!: Date;
}

