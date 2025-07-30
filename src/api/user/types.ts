import { Role } from "@prisma/client";

export interface TokenPayload {
  phone: string;
  id: number;
  role: string;
  firstName: string;
  lastName: string;
  username?: string;
  officeId?: number | null;
  userOffice?: Array<{
    id: number, office: {
      name: string;
    }
  }>;
}

export enum Roles {
  ADMIN = "ADMIN",
  FINANCE = "FINANCE",
  POLICE_OFFICER = "POLICE_OFFICER",
  POLICE_COMMANDER = "POLICE_COMMANDER",
  FARMER = "FARMER",
  POLICE_PRODUCTION = "POLICE_PRODUCTION",
  VERSIFICATION_OFFICER = "VERSIFICATION_OFFICER"

}

export interface UserRecord {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password?: string;
  username?: string;
  role: Role;
  officeId?: number | null;
  isActive?: boolean;
  userOffice?: []
}
