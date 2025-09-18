import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Layer {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int' })
  projectId!: number;

  @Column({ type: 'int' })
  userId!: number;

  @Column({ type: 'varchar', length: 255 })
  type!: string; // e.g. 'image' | 'text' | 'shape'

  @Column({ type: 'json' })
  data!: Record<string, any>;

  @Column({ type: 'int', default: 0 })
  zIndex!: number;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}

