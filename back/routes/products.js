var express = require("express");
var router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.get("/products", async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    console.error("Erro ao obter produtos:", error);
    res.status(500).json({ message: "Erro ao obter produtos" });
  }
});

router.post("/products", async (req, res) => {
  const newProduct = req.body;

  try {
    const product = await prisma.product.create({
      data: newProduct,
    });
    res.status(201).json(product);
  } catch (error) {
    console.error("Erro ao adicionar produto:", error);
    res.status(500).json({ message: "Erro ao adicionar produto" });
  }
});

router.put("/products/:id", async (req, res) => {
  const productId = parseInt(req.params.id);
  const updatedProduct = req.body;

  try {
    const product = await prisma.product.update({
      where: { id: productId },
      data: updatedProduct,
    });
    res.json(product);
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    res.status(500).json({ message: "Erro ao atualizar produto" });
  }
});

router.delete("/products/:id", async (req, res) => {
  const productId = parseInt(req.params.id);

  try {
    await prisma.product.delete({
      where: { id: productId },
    });
    res.status(204).send();
  } catch (error) {
    console.error("Erro ao excluir produto:", error);
    res.status(500).json({ message: "Erro ao excluir produto" });
  }
});
module.exports = router;
