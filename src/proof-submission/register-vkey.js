const { zkVerifySession, Library, CurveType, ZkVerifyEvents } = require("zkverifyjs");
const fs = require("fs");
const vkey = require("./data/main.groth16.vkey.json");

(async () => {
  const session = await zkVerifySession
    .start()
    .Volta()
    .withAccount("dish cram almost increase crumble ghost decrease crane disease surge couch trigger");

  const { events } = await session
    .registerVerificationKey()
    .groth16({ library: Library.snarkjs, curve: CurveType.bn128 })
    .execute(vkey);

  events.on(ZkVerifyEvents.Finalized, (eventData) => {
    console.log("✅ VK registrada:", eventData.statementHash);
    fs.writeFileSync("vkey.json", JSON.stringify({ hash: eventData.statementHash }, null, 2));
  });
})();
