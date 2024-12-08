// Nestjs dependencies
import { SetMetadata } from '@nestjs/common';

// Lib
import { UserRole } from '@app/common/enums';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
