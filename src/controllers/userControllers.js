import { PrismaClient } from "@prisma/client";
import { comparePassword, generateToken, hashPassword } from "../utils/auth.js";
const prisma = new PrismaClient();

export const registerUser = async (req, res) => {
  const { name, email, phone, password } = req.body;
  try {
    const hashedPassword = await hashPassword(password);
    const newRegisteredUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        phone: phone,
        password: hashedPassword,
      },
    });
    const token = generateToken(newRegisteredUser);
    res.status(201).json({
      name: newRegisteredUser.name,
      email: newRegisteredUser.email,
      phone: newRegisteredUser.phone,
      token: token,
    });
  } catch (error) {
    res.status(400).json({
      erro: "Erro ao tentar registrar o usuário",
      detalhes: error.message,
    });
  }
};

export const registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await hashPassword(password);
    const newAdminUser = await prisma.admin.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
      },
    });
    const token = generateToken(newAdminUser);
    res.status(201).json({
      name: newAdminUser.name,
      email: newAdminUser.email,
      token: token,
    });
  } catch (error) {
    res.status(400).json({
      erro: "Erro ao tentar registrar o usuário",
      detalhes: error.message,
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (user) {
      const userPasswordMatch = await comparePassword(password, user.password);

      const token = generateToken(user);

      if (!userPasswordMatch) {
        return res.status(401).json({
          message: "Credenciais Inválida!",
        });
      }

      res.json({
        usuario: {
          name: user.name,
          email: user.email,
          message: `Bem-Vindo usuário ${user.name}`,
        },
        token,
      });
    } else if (admin) {
      const adminPasswordMatch = await comparePassword(
        password,
        admin.password
      );

      const token = generateToken(admin);

      if (!adminPasswordMatch) {
        return res.status(401).json({
          message: "Credenciais Inválida!",
        });
      }

      res.json({
        usuario: {
          name: admin.name,
          email: admin.email,
          message: `Bem-Vindo administrador ${admin.name}`,
        },
        token,
      });
    } else if (!admin || !user) {
      return res.status(401).json({
        message: "Credenciais Inválida!",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Erro ao fazer o login!",
      error,
    });
  }
};
