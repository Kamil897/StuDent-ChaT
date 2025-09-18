import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class EditHistory {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int' })
  projectId!: number;

  @Column({ type: 'int' })
  userId!: number;

  @Column({ type: 'varchar', length: 64 })
  action!: string; // e.g. 'add_layer', 'move', 'update', 'delete'

  @Column({ type: 'json', nullable: true })
  payload?: Record<string, any> | null;

  @CreateDateColumn()
  created_at!: Date;
}

