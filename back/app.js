const express = require("express");
const { PrismaClient } = require("@prisma/client");
const axios = require("axios");
const cors = require("cors");
const http = require("http");
const bodyParser = require("body-parser");
const { authenticateToken } = require("./middlewares/jwt");
const app = express();
const authRouter = require("./routes/auth");
const productsRouter = require("./routes/products");
const port = process.env.PORT || "5000";

app.set("port", port);
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use("/products", authenticateToken);
app.use("/", productsRouter);
app.use("/", authRouter);

const prisma = new PrismaClient();

async function main() {
  if (
    await prisma.product.findUnique({
      where: { id: 1 },
    })
  ) {
    console.log("Produtos já incluídos no sistema");
    return;
  }

  axios
    .get("https://dummyjson.com/products?limit=100")
    .then(async (response) => {
      response.data.products.forEach(async (product) => {
        await prisma.product.create({
          data: {
            ...product,
            images: { create: product.images.map((i) => ({ url: i })) },
          },
        });
      });
    })
    .catch((error) => {
      console.error("Erro na requisição:", error);
    });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

const server = http.createServer(app);

server.listen(port);
