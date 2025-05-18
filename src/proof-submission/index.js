const { zkVerifySession, Library, CurveType, ZkVerifyEvents } = require("zkverifyjs");
const fs = require("fs");
const proof = require("./data/proof.json");
const publicSignals = require("./data/public.json");
const vkey = require("./data/main.groth16.vkey.json");

let statement; // variável global

async function main() {
  const session = await zkVerifySession
    .start()
    .Volta() // Testnet do zkVerify
    .withAccount("dish cram almost increase crumble ghost decrease crane disease surge couch trigger");

  // 1. Registrar a verification key (vkey)
  const { events: regEvents } = await session
    .registerVerificationKey()
    .groth16({
      library: Library.snarkjs,
      curve: CurveType.bn128,
    })
    .execute(vkey);

  regEvents.on(ZkVerifyEvents.Finalized, (eventData) => {
    console.log("VK registrada com sucesso!");
    fs.writeFileSync("vkey.json", JSON.stringify({ hash: eventData.statementHash }, null, 2));
  });

  // 2. Escutar agregação de prova
  session.subscribe([
    {
      event: ZkVerifyEvents.NewAggregationReceipt,
      callback: async (eventData) => {
        console.log("Nova agregação recebida:", eventData);
        const statementPath = await session.getAggregateStatementPath(
          eventData.blockHash,
          parseInt(eventData.data.domainId),
          parseInt(eventData.data.aggregationId),
          statement
        );
        const aggregation = {
          ...statementPath,
          domainId: parseInt(eventData.data.domainId),
          aggregationId: parseInt(eventData.data.aggregationId),
        };
        fs.writeFileSync("aggregation.json", JSON.stringify(aggregation, null, 2));
        console.log("aggregation.json salvo!");
      },
      options: { domainId: 0 },
    },
  ]);

  // 3. Verificar a prova
  const { events: verifyEvents } = await session
    .verify()
    .groth16({
      library: Library.snarkjs,
      curve: CurveType.bn128,
    })
    .withRegisteredVk()
    .execute({
      proofData: {
        vk: vkey.hash,
        proof: proof,
        publicSignals: publicSignals,
      },
      domainId: 0,
    });

  verifyEvents.on(ZkVerifyEvents.IncludedInBlock, (eventData) => {
    console.log("Prova incluída no bloco.");
    statement = eventData.statement;
  });
}

main().catch((err) => {
  console.error("Erro:", err);
});
