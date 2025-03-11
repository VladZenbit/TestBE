import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { type UserEntity } from './user.entity';

@Entity({ name: 'movies' })
export class MovieEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'Unique identifier for the movie' })
  id: string;

  @Column()
  @ApiProperty({ description: 'Name of the movie' })
  name: string;

  @Column({ type: 'text' })
  @ApiProperty({ description: 'Description of the movie' })
  description: string;

  @Column()
  @ApiProperty({ description: 'URL of the movie image' })
  imageUrl: string;

  @ManyToOne('UserEntity', (user: UserEntity) => user.movies, {
    onDelete: 'CASCADE',
  })
  @ApiProperty({ description: 'Owner of the movie' })
  user: UserEntity;

  @CreateDateColumn({ name: 'created_at' })
  @ApiProperty({ description: 'Created date of the movie' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @ApiProperty({ description: 'Updated date of the movie' })
  updatedAt: Date;
}
