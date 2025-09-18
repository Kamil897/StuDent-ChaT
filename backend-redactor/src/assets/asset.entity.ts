import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Asset {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text')
  url!: string;

  @Column({ nullable: true, type: 'text' })
  prompt!: string;

  @Column({ nullable: true })
  filename!: string;

  @CreateDateColumn()
  created_at!: Date;
}
