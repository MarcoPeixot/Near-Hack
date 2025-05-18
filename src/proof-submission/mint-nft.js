const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const { ethers } = require("ethers");
const fs = require("fs");

const prisma = new PrismaClient();
const abi = require("./abi.json");

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, signer);

router.post("/", async (req, res) => {
  const { alunoId } = req.body;

  try {
    const aluno = await prisma.aluno.findUnique({
      where: { id: alunoId },
      include: { escola: true },
    });

    if (!aluno) return res.status(404).json({ error: "Aluno não encontrado" });

    const metadata = {
      name: aluno.nome,
      description: `Aluno do curso de ${aluno.escola.nome}`,
      attributes: [
        { trait_type: "Curso", value: aluno.escola.nome },
        { trait_type: "Escola", value: aluno.escola.nome }
      ]
    };

    const base64json = Buffer.from(JSON.stringify(metadata)).toString("base64");
    const tokenURI = `data:application/json;base64,${base64json}`;

    const tx = await contract.mintWithVerifiedProof(
      aluno.walletAddress,
      tokenURI,
      [],                     // proof
      ethers.ZeroHash,       // aggregation
      0, 0, ethers.ZeroHash, // outros campos
      0, 0
    );

    await tx.wait();
    res.json({ message: "NFT mintado com sucesso", txHash: tx.hash });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao mintar NFT", details: err.message });
  }
});

module.exports = router;
