# json-store-factory

Function that returns a store that can save/load sync/async data into a specified JSON file.

No dependencies at all.

## Why

To have this repeated pattern of code uploaded as an external module.

## Installation

`$ npm i -s json-store-factory`

## Explanation

This tool gives you an interface to `load`/`save`/`get`/`set`/`delete` data of a `json` file, in a `sync` or `async` way.

## Usage

### Basic operations

1. *create* store
2. *save* store
3. *load* store
4. *get* store data
5. *set* store data
6. *delete* store


----


### 1. Create a store:

```js
const jsonStoreFactory = require("json-store-factory");
const store = jsonStoreFactory("./store.json", { beautify: true });
```


----


### 2. Save new data:

**Synchronously:**

```js
store.saveSync({ title: "My title", info: { author: "someone" } });
```

**Asynchronously:**

```js
await store.save({ title: "My title", info: { author: "someone" }  });
```


----


### 3. Load data:

**Synchronously:**

```js
const data = store.loadSync();
```

**Asynchronously:**

```js
const data = await store.load();
```


----


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

----



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

----


### 6. Delete store:

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

Synchronous operations can throw errors due to filesystem operations or JSON transformations.

## Internal API

Due to how very useful are the internal methods of the API, they are also available through the function the module is:

- `getter`: this function...
  - ...receives:
    - `data:Object`: data to be altered.
    - `selector:Array|String`: selector of the data we want to get.
    - `defaultValue:any`: the value returned when it is not found.
- `setter`: this function...
  - ...receives:
    - `data:Object`: data to be altered.
    - `selector:Array|String`: selector of the data we want to set.
    - `value:any`: the value we want to assign to the provided selection.
    - `force:Boolean`: whether or not we want to force the creation of intermediate objects. Defaults to `false`.
- `deleter`: this function...
  - ...receives:
    - `data:Object`: data to be altered.
    - `selector:Array|String`: selector of the data we want to delete.

They all return the resulted data.

*Note: This internal API is available for browser environments too.*

## Tests

To run tests, place the `cmd` in the `json-store-factory` project and run:

`$ npm run test`

As it does not hace external dependencies, it should work.

## License

This project is released under [**WTFPL** or **What The Fuck Public License**](https://en.wikipedia.org/wiki/WTFPL), which means **do what you want**, basically.

## Issues

Please, address your issues [here](https://github.com/allnulled/json-store-factory/issues).