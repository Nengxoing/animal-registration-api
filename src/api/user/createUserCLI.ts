import { PrismaClient, Role } from "@prisma/client";
import { Command } from "commander";
import inquirer from "inquirer";
import { hashPassword } from "./lib";

const prisma = new PrismaClient();
const program = new Command();

const promptUserDetails = async () => {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "username",
      message: "Username:",
      default: "admin",
      validate: (input) => (input ? true : "Username is required"),
    },
    {
      type: "input",
      name: "firstName",
      message: "First name:",
      default: "Super",
      validate: (input) => (input ? true : "First name is required"),
    },
    {
      type: "input",
      name: "lastName",
      message: "Last name:",
      default: "Admin",
      validate: (input) => (input ? true : "Last name is required"),
    },
    {
      type: "input",
      name: "email",
      message: "Email:",
      default: "lit@gmail.com",
      validate: (input) => (input ? true : "Email is required"),
    },
    {
      type: "input",
      name: "phone",
      message: "Phone number:",
      default: "59684710",
      validate: (input) => {
        if (!input) {
          return "Phone number is required";
        }
        if (!/^\d{8}$/.test(input)) {
          return "Phone number must be exactly 8 digits and contain only numbers";
        }
        return true;
      },
    },

    {
      type: "password",
      name: "password",
      message: "Password:",
      default: "Lit@2024",
      validate: (input) => (input ? true : "Password is required"),
    },
    {
      type: "list",
      name: "role",
      message: "Role (e.g., Admin or User):",
      choices: [Role.ADMIN, Role.SUPER_ADMIN, Role.FINANCE, Role.POLICE_OFFICER, Role.POLICE_COMMANDER, Role.FARMER, Role.POLICE_PRODUCTION],
      default: Role.ADMIN,
    },
  ]);

  return answers;
};

const createSuperUser = async () => {
  const userDetails = await promptUserDetails();

  const { firstName, lastName, email, phone, password, role, username } = userDetails;

  const hashedPassword = hashPassword(password);

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return;
  }

  try {
    await createUserService({
      username,
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      role,
    });
  } catch {
  }
};

program
  .command("createsuperuser")
  .description("Create a superuser")
  .action(createSuperUser);
program.parse(process.argv);

export const createUserService = async (user: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: Role;
  username: string
}) => {
  try {
    return await prisma.user.create({
      data: {
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        password: user.password,
        role: user.role,
        isActive: true,
      },
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      const field = error.meta?.target?.join(", ") || "unknown field";
      throw new Error(`Unique constraint failed on the field(s): ${field}`);
    }
    throw error;
  }
};