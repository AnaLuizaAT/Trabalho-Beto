const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET;
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user || user.password !== password) {
    res.status(401).json({ message: "Credenciais inválidas" });
    return;
  }

  const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: "1h" });

  res.json({ token });
});

router.post("/register", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const existingUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (existingUser) {
    res.status(400).json({ message: "Este email já está em uso" });
    return;
  }

  const newUser = await prisma.user.create({
    data: {
      email: email,
      password: password,
    },
  });

  const token = jwt.sign({ id: newUser.id }, secretKey, { expiresIn: "1h" });
  res.json({ token });
});
module.exports = router;
