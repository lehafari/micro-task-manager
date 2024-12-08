// Other dependencies
import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';
import { hash } from 'bcryptjs';

// Lib
import { UserRole } from '@app/common/enums';

@Entity('auth_user')
export class AuthUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.MEMBER,
  })
  role: UserRole;

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 10);
  }
}
