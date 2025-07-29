const kv = await Deno.openKv();
for await (const entry of kv.list({ prefix: ["events"] })) {
  console.log(entry.key);
}
