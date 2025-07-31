import { UserRole } from '../../common/enums/user-role.enum';

export class UserResponseDto {
  id: number;
  username: string;
  email: string;
  address: string | null;
  phone: string | null;
  role: UserRole;
} 
