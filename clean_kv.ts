// clean_kv.ts
const kv = await Deno.openKv();

for await (const entry of kv.list({ prefix: [] })) {
  console.log("Deleting", entry.key);
  await kv.delete(entry.key);
}

console.log("KV store cleared.");
