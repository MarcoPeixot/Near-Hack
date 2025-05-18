// mint-nft.js
// Este script gera um tokenURI simples (sem imagem) e chama a função mintWithVerifiedProof()

const { ethers } = require("ethers");
const fs = require("fs");

require("dotenv").config();
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const contractAddress = "0x29aBD0a13E6C1665D1955FD431479118Bb304552";
const abi = require("./abi.json"); 

const contract = new ethers.Contract(contractAddress, abi, signer);

const aluno = {
  nome: "Lucas Britto",
  curso: "Ciência da Computação",
  periodo: "3º Semestre",
  carteira: "0x11FbD2E02ca5bCd2f8e9A7e09089A9c877760113"
};

const metadata = {
  name: aluno.nome,
  description: `Aluno do curso de ${aluno.curso}`,
  attributes: [
    { trait_type: "Curso", value: aluno.curso },
    { trait_type: "Período", value: aluno.periodo }
  ]
};

const base64json = Buffer.from(JSON.stringify(metadata)).toString("base64");
const tokenURI = `data:application/json;base64,${base64json}`;

async function mint() {
  try {
    const tx = await contract.mintWithVerifiedProof(
      aluno.carteira,
      tokenURI,
      [],
      ethers.ZeroHash,
      0, 0, ethers.ZeroHash, 0, 0
    );
    console.log("NFT enviado, aguardando confirmação...");
    await tx.wait();
    console.log("NFT criado com sucesso para:", aluno.nome);
  } catch (err) {
    console.error("Erro ao mintar NFT:", err);
  }
}

mint();
