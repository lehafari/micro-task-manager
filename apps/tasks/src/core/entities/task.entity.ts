// Other dependencies
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

// Lib
import { TaskStatus } from '@app/common/enums';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ type: 'timestamp' })
  dueDate: Date;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.TODO,
  })
  status: TaskStatus;

  @Column('uuid')
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('uuid', { nullable: true })
  assignedUserId: string;

  @Column('uuid', { nullable: true })
  assignedTeamId: string;

  @BeforeInsert()
  @BeforeUpdate()
  validateAssignment() {
    if (this.assignedUserId && this.assignedTeamId) {
      throw new Error('Task cannot be assigned to both a user and a team');
    }
  }
}
