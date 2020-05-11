# json-store-factory

Function that returns a store that can save/load sync/async data into a specified JSON file.

No dependencies at all.

## Why

To have this repeated pattern of code uploaded as an external module.

## Installation

`$ npm i -s json-store-factory`

## Explanation

This tool gives you an interface to `load`/`save`/`get`/`set`/`modify`/`delete` data of a `json` file, in a `sync` or `async` way.

## Usage

### Basic operations

1. *create* store
2. *save* store
3. *load* store
4. *get* store data
5. *set* store data
6. *modify* store
7. *delete* store

### 1. Create a store:

```js
const jsonStoreFactory = require("json-store-factory");
const store = jsonStoreFactory("./store.json", { beautify: true });
```

### 2. Save new data:

**Synchronously:**

```js
store.saveSync({ title: "My title", info: { author: "someone" } });
```

**Asynchronously:**

```js
await store.save({ title: "My title", info: { author: "someone" }  });
```

### 3. Load data:

**Synchronously:**

```js
const data = store.loadSync();
```

**Asynchronously:**

```js
const data = await store.load();
```

### 4. Get data:

**Pass a selector (array of property names) indicating what you want to get from the store.** You can pass a default value too.

**Synchronously:**

```js
const item = store.getSync(["info", "author"], "Optional default value"); // returns: "someone"
```

**Asynchronously:**

```js
const item = await store.get(["info", "author"], "Optional default value");
```

### 5. Set data:

**Pass a selector (array of property names) indicating what you want to set from the store, and the value for it.** The resultant data is returned.

**Synchronously:**

```js
store.setSync(["title"], "My new title");
```

**Asynchronously:**

```js
await store.set(["title"], "My new title");
```

### 6. Modify data:

**Pass a function that receives the old data, and returns the new data.** The new data is returned.

**Synchronously:**

```js
await store.modifySync(data => {
	data.title = "My new title";
	return data;
});
```

**Asynchronously:**

```js
await store.modify(data => {
	data.title = "My new title";
	return data;
});
```

### 7. Delete store:

**Synchronously:**

```js
store.deleteSync();
```

**Asynchronously:**

```js
await store.delete();
```

You can also delete specific parts of the store by providing selectors:

**Synchronously:**

```js
const store = store.deleteSync("title");
```

**Asynchronously:**

```js
const store = await store.delete(["title"]);
```

## API

The module is a simple function that takes 3 arguments:

- `store:String`: path to the store.
- `settings:Object`: settings for the store. Currently, only `beautify:Boolean` is allowed (which defaults to `true`).
- `extensions:Object`: extensions for the store instance. Properties and methods that will be added to the store (which defaults to `{}`).

The signatures of the methods of the store can be guessed by the [**Usage** section](#usage) of this document.

## License

This project is released under [**WTFPL** or **What The Fuck Public License**](https://en.wikipedia.org/wiki/WTFPL), which means **do what you want**, basically.

## Issues

Please, address your issues [here](https://github.com/allnulled/json-store-factory/issues).