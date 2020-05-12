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
console.log("✓ can set up");
// 1. create store:
const store = jsonFactory(storePath);
if (fs.existsSync(storePath)) {
	throw new Error("[2] Sync test failed")
}
console.log("✓ can create store");
// 2. save store sync:
store.saveSync({});
if (!fs.existsSync(storePath)) {
	throw new Error("[3] Sync test failed")
}
console.log("✓ can save store");
// 3. load store sync:
fs.writeFileSync(storePath, '{"id":0}', "utf8");
const data = store.loadSync();
if (typeof data !== "object") {
	throw new Error("[4] Sync test failed")
}
console.log("✓ can load store");
// 4. access data:
if (data.id !== 0) {
	throw new Error("[5] Sync test failed")
}
console.log("✓ can access data loaded");
// 5. delete store sync:
if (!fs.existsSync(storePath)) {
	throw new Error("[6] Sync test failed")
}
store.deleteSync();
if (fs.existsSync(storePath)) {
	throw new Error("[7] Sync test failed")
}
console.log("✓ can delete store");
store.saveSync({
	id: 0,
	author: {
		name: "some author"
	},
});
// 6. get store item sync:
const id = store.getSync("id", 1);
if (id !== 0) {
	throw new Error("[8] Sync test failed");
}
console.log("✓ can get store data");
// 7. set store item sync:
const newData = store.setSync(["author", "name"], "new author");
if (newData.author.name !== "new author") {
	throw new Error("[9] Sync test failed");
}
console.log("✓ can set store data");
// 8. set store item sync forcedly:
const newData2 = store.setSync(["author", "details", "country"], "somewhere");
if (newData2.author.details.country !== "somewhere") {
	console.log(newData2);
	throw new Error("[10] Sync test failed");
}
console.log("✓ can set store data forcedly");
const data4 = store.deleteSync(["author", "details"]);
if ("details" in data4.author) {
	throw new Error("[11] Sync test failed");
}
console.log("✓ can delete store specific data");


(async () => {
	try {
		// 0. set up:
		try {
			fs.unlinkSync(storePath)
		} catch (error) {}
		if (fs.existsSync(storePath)) {
			throw new Error("[1] Async test failed")
		}
		console.log("✓ can set up (async)");
		// 1. create store:
		const store = jsonFactory(storePath);
		if (fs.existsSync(storePath)) {
			throw new Error("[2] Async test failed")
		}
		console.log("✓ can create store (async)");
		// 2. save store:
		await store.save({});
		if (!fs.existsSync(storePath)) {
			throw new Error("[3] Async test failed")
		}
		console.log("✓ can save store (async)");
		// 3. load store:
		fs.writeFileSync(storePath, '{"id":0}', "utf8");
		const data = await store.load();
		if (typeof data !== "object") {
			throw new Error("[4] Async test failed")
		}
		console.log("✓ can load store (async)");
		// 4. access data:
		if (data.id !== 0) {
			throw new Error("[5] Async test failed")
		}
		console.log("✓ can access data loaded (async)");
		// 5. delete store:
		if (!fs.existsSync(storePath)) {
			throw new Error("[6] Async test failed")
		}
		await store.delete();
		if (fs.existsSync(storePath)) {
			throw new Error("[7] Async test failed")
		}
		console.log("✓ can delete store (async)");
		await store.save({
			id: 0,
			author: {
				name: "some author"
			}
		});
		// 6. get store item:
		const id = await store.get("id", 1);
		if (id !== 0) {
			throw new Error("[8] Async test failed");
		}
		console.log("✓ can get store data (async)");
		// 7. set store item:
		const data2 = await store.set(["author", "name"], "new author");
		if (data2.author.name !== "new author") {
			throw new Error("[9] Async test failed");
		}
		console.log("✓ can set store data (async)");
		// 8. set store item forcedly:
		const data3 = await store.set(["author", "details", "country"], "somewhere");
		if (data3.author.details.country !== "somewhere") {
			throw new Error("[10] Async test failed");
		}
		console.log("✓ can set store data forcedly (async)");
		// 8. delete store item:
		const data4 = await store.delete(["author", "details"]);
		if ("details" in data4.author) {
			throw new Error("[11] Async test failed");
		}
		console.log("✓ can delete store specific data (async)");
		fs.unlinkSync(storePath);
		console.log("[OK] Test passed successfully\n");
	} catch (error) {
		throw error;
	}
})();