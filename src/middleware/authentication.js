import { verifyToken } from "../utils/auth.js";

export function authenticate(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      mensagem: "Token de acesso não fornecido.",
    });
  }
  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({
      mensagem: "Token inválido ou Expirado.",
    });
  }
}
