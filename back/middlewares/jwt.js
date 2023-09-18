const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET;

function generateToken(user) {
  return jwt.sign(user, secretKey, { expiresIn: "1h" });
}

function authenticateToken(req, res, next) {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Acesso não autorizado" });

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.status(403).json({ message: "Token inválido" });
    req.user = user;
    next();
  });
}

module.exports = { generateToken, authenticateToken };
