import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  @IsString()
  name: string;

  @Column({ type: 'text' })
  type: string;

  @Column({ default: true })
  @Expose()
  isActive: boolean;

}