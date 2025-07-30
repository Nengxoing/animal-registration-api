import bcrypt from "bcrypt";
import { findOneUserServicer } from "../../api/user/service";

export const getUserByUsername = async (username: string) => {
  return await findOneUserServicer(username);
};

export const validatePassword = (
  plainPassword: string,
  hashedPassword: string,
): boolean => {
  return bcrypt.compareSync(plainPassword, hashedPassword);
};

export const buildPayload = (user: any) => ({
  id: user.id,
  phone: user.phone,
  role: user.role,
  firstName: user.firstName,
  email: user.email,
  officeId: user.officeId,
  lastName: user.lastName,
  username: user.username,
  userOffice: user.userOffice ?? [],
});
