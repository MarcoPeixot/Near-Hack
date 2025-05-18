const express = require("express");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const mintRoute = require("./mint-nft");

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use("/mint-nft", mintRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
