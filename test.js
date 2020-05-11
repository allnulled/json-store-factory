const jsonFactory = require(__dirname + "/index.js");
const fs = require("fs");
const storePath = __dirname + "/store.json";
// 0. set up:
try {
	fs.unlinkSync(storePath)
} catch (error) {}
if (fs.existsSync(storePath)) {
	throw new Error("[1] Sync test failed")
}
// 1. create store:
const store = jsonFactory(storePath);
if (fs.existsSync(storePath)) {
	throw new Error("[2] Sync test failed")
}
// 2. save store sync:
store.saveSync({});
if (!fs.existsSync(storePath)) {
	throw new Error("[3] Sync test failed")
}
// 3. load store sync:
fs.writeFileSync(storePath, '{"id":0}', "utf8");
const data = store.loadSync();
if (typeof data !== "object") {
	throw new Error("[4] Sync test failed")
}
// 4. access data:
if (data.id !== 0) {
	throw new Error("[5] Sync test failed")
}
// 5. delete store sync:
if (!fs.existsSync(storePath)) {
	throw new Error("[6] Sync test failed")
}
store.deleteSync();
if (fs.existsSync(storePath)) {
	throw new Error("[7] Sync test failed")
}
store.saveSync({
	id: 0
});
// 6. get store item sync:
const id = store.getSync("id", 1);
if (id !== 0) {
	throw new Error("[8] Sync test failed");
}



(async () => {
	try {
		// 0. set up:
		try {
			fs.unlinkSync(storePath)
		} catch (error) {}
		if (fs.existsSync(storePath)) {
			throw new Error("[1] Async test failed")
		}
		// 1. create store:
		const store = jsonFactory(storePath);
		if (fs.existsSync(storePath)) {
			throw new Error("[2] Async test failed")
		}
		// 2. save store sync:
		await store.save({});
		if (!fs.existsSync(storePath)) {
			throw new Error("[3] Async test failed")
		}
		// 3. load store sync:
		fs.writeFileSync(storePath, '{"id":0}', "utf8");
		const data = await store.load();
		if (typeof data !== "object") {
			throw new Error("[4] Async test failed")
		}
		// 4. access data:
		if (data.id !== 0) {
			throw new Error("[5] Async test failed")
		}
		// 5. delete store sync:
		if (!fs.existsSync(storePath)) {
			throw new Error("[6] Async test failed")
		}
		await store.delete();
		if (fs.existsSync(storePath)) {
			throw new Error("[7] Async test failed")
		}
		await store.save({
			id: 0,
			name: "name"
		});
		// 6. get store item sync:
		const id = await store.get("id", 1);
		if (id !== 0) {
			throw new Error("[8] Sync test failed");
		}
		fs.unlinkSync(storePath);
		console.log("[OK] Test passed successfully\n");
	} catch (error) {
		throw error;
	}
})();