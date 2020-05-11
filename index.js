const fs = require("fs");
const path = require("path");
const DEFAULT_SETTINGS = { beautify: true };
const getter = (data, selectorP, defaultValue) => {
	const validTypes = ["object","function","string"];
	const selector = Array.isArray(selectorP) ? selectorP : [].concat(selectorP);
	let dataItem = data;
	let index = 0;
	while(index < selector.length) {
		const property = selector[index];
		if((validTypes.indexOf(typeof dataItem) !== -1 || (index !== selector.length - 1)) && (property in dataItem)) {
			dataItem = dataItem[property];
		} else {
			return defaultValue;
		}
		index++;
	}
	return dataItem;
};
const setter = (data, selectorP, value, force = false) => {

};

module.exports = function(store = __dirname + "/store.json", settings = {}, extensions = {}) {
	this.store = path.resolve(store);
	this.settings = Object.assign(DEFAULT_SETTINGS, settings);
	this.loadSync = () => {
		return JSON.parse(fs.readFileSync(this.store).toString());
	};
	this.load = () => {
		return new Promise((ok, fail) => {
			return fs.readFile(this.store, "utf8", (error, contents) => {
				if(error) {
					return fail(error);
				}
				try {
					return ok(JSON.parse(contents));
				} catch(error) {
					return fail(error);
				}
			});
		});
	};
	this.saveSync = (data = undefined) => {
		if(this.settings.beautify) {
			fs.writeFileSync(this.store, JSON.stringify(data, null, 2), "utf8");
		} else {
			fs.writeFileSync(this.store, JSON.stringify(data), "utf8");
		}
		return this;
	};
	this.save = (data) => {
		return new Promise((ok, fail) => {
			try {
				let contents = undefined;
				if(this.settings.beautify) {
					contents = JSON.stringify(data, null, 2);
				} else {
					contents = JSON.stringify(data);
				}
				return fs.writeFile(this.store, contents, "utf8", (error, contents) => {
					if(error) {
						return fail(error);
					}
					return ok(this);
				});
			} catch(error) {
				return fail(error);
			}
		});
	};
	this.deleteSync = () => {
		fs.unlinkSync(this.store);
		return this;
	};
	this.delete = () => {
		return new Promise((ok, fail) => {
			return fs.unlink(this.store, error => {
				if(error) {
					return fail(error);
				}
				return ok(this);
			});
		});
	};
	this.getSync = (selector, defaultValue = undefined) => {
		const data = JSON.parse(fs.readFileSync(this.store).toString());
		return getter(data, selector, defaultValue);
	};
	this.get = (selector, defaultValue = undefined) => {
		return new Promise((ok, fail) => {
			return fs.readFile(this.store, "utf8", (error, contents) => {
				if(error) {
					return fail(error);
				}
				try {
					const data = JSON.parse(contents);
					const item = getter(data, selector, defaultValue);
					return ok(item);
				} catch(error) {
					return fail(error);
				}
			});
		});
	};
	this.setSync = (selector) => {
		// @TODO
	};
	this.set = () => {
		return new Promise((ok, fail) => {
			// @TODO
		});
	};
	Object.assign(this, extensions);
	return this;
}