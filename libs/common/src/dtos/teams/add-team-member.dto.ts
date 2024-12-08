// Nestjs dependencies
import { ApiProperty } from '@nestjs/swagger';

// Other dependencies
import { IsUUID, IsNotEmpty } from 'class-validator';

export class AddTeamMemberDto {
  @ApiProperty({
    description: 'UUID of the user to add to the team',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  @IsUUID('4', { message: 'Invalid user ID format' })
  @IsNotEmpty()
  userId: string;
}
