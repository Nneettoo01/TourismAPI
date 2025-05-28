import { PrismaClient } from "@prisma/client";
import { verifyToken } from "../utils/auth.js";
const prisma = new PrismaClient();

export async function authenticateAdmin(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      message: "Token de acesso não fornecido!",
    });
  }
  try {
    const decoded = verifyToken(token);
    const admin = await prisma.admin.findUnique({
      where: { id: decoded.id },
    });
    if (!admin) {
      return res.status(401).json({
        message: "Usuário não é um admin!",
      });
    }
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(403).json({
      message: "Token inválido ou Expirado!",
      error,
    });
  }
}
