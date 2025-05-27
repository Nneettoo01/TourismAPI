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

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return res.status(401).json({
        mensagem: "Credenciais inválidas",
      });
    }
    const passwordMacth = await comparePassword(password, user.password);
    if (!passwordMacth) {
      return res.status(401).json({
        mensagem: "Credenciais inválidas",
      });
    }
    const token = generateToken(user);
    res.status(200).json({
      usuario: { name: user.name, email: user.email },
      token: token,
    });
  } catch (error) {
    res.status(500).json({
      mensagem: "Erro ao tentar fazer login",
      erro: error.message,
    });
  }
};
