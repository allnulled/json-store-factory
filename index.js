const DEFAULT_SETTINGS = {
    beautify: true
};
const validTypes = ["object", "string", "function"];
const getter = (data, selectorP, defaultValue) => {
    const selector = Array.isArray(selectorP) ? selectorP : [].concat(selectorP);
    let dataItem = data;
    let index = 0;
    while (index < selector.length) {
        const property = selector[index];
        if (((validTypes.indexOf(typeof dataItem) !== -1) || (index !== selector.length - 1)) && (property in dataItem)) {
            dataItem = dataItem[property];
        } else {
            return defaultValue;
        }
        index++;
    }
    return dataItem;
};
const setter = (data, selectorP, value, force = false) => {
    const selector = Array.isArray(selectorP) ? selectorP : [].concat(selectorP);
    let dataItem = data;
    let index = 0;
    const lastIndex = selector.length - 1;
    while (index < selector.length) {
        const property = selector[index];
        if (index === lastIndex) {
            dataItem[property] = value;
        } else if (validTypes.indexOf(typeof dataItem) !== -1) {
            if (!(property in dataItem)) {
                dataItem[property] = {};
            }
            dataItem = dataItem[property];
        } else if (force) {
            dataItem[property] = {};
            dataItem = dataItem[property];
        } else {
            throw new Error("SetterError:" + property);
        }
        index++;
    }
    return data;
};
const deleter = (data, selectorP, value) => {
    const selector = Array.isArray(selectorP) ? selectorP : [].concat(selectorP);
    let dataItem = data;
    let index = 0;
    const lastIndex = selector.length - 1;
    while (index < selector.length) {
        const property = selector[index];
        if (index === lastIndex) {
            delete dataItem[property];
        } else if (validTypes.indexOf(typeof dataItem) !== -1) {
            if (!(property in dataItem)) {
                dataItem[property] = {};
            }
            dataItem = dataItem[property];
        } else {
            throw new Error("SetterError:" + property);
        }
        index++;
    }
    return data;
};
const JSONStoreFactory = function(store = __dirname + "/store.json", settings = {}, extensions = {}) {
    const fs = require("fs");
    const path = require("path");
    this.store = path.resolve(store);
    this.settings = Object.assign(DEFAULT_SETTINGS, settings);
    this.loadSync = () => {
        return JSON.parse(fs.readFileSync(this.store).toString());
    };
    this.load = () => {
        return new Promise((ok, fail) => {
            return fs.readFile(this.store, "utf8", (error, contents) => {
                if (error) {
                    return fail(error);
                }
                try {
                    return ok(JSON.parse(contents));
                } catch (error) {
                    return fail(error);
                }
            });
        });
    };
    this.saveSync = (data = undefined) => {
        if (this.settings.beautify) {
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
                if (this.settings.beautify) {
                    contents = JSON.stringify(data, null, 2);
                } else {
                    contents = JSON.stringify(data);
                }
                return fs.writeFile(this.store, contents, "utf8", (error, contents) => {
                    if (error) {
                        return fail(error);
                    }
                    return ok(this);
                });
            } catch (error) {
                return fail(error);
            }
        });
    };
    this.deleteSync = (selector = undefined) => {
        if (typeof selector === "undefined") {
            fs.unlinkSync(this.store);
            return this;
        } else {
            const contents = fs.readFileSync(this.store).toString();
            const data = JSON.parse(contents);
            const dataTransformed = deleter(data, selector);
            if (this.settings.beautify) {
                const contentsTransformed = JSON.stringify(dataTransformed, null, 4);
                fs.writeFileSync(this.store, contentsTransformed, "utf8");
            } else {
                const contentsTransformed = JSON.stringify(dataTransformed);
                fs.writeFileSync(this.store, contentsTransformed, "utf8");
            }
            return dataTransformed;
        }
    };
    this.delete = (selector = undefined) => {
        if (typeof selector === "undefined") {
            return new Promise((ok, fail) => {
                return fs.unlink(this.store, error => {
                    if (error) {
                        return fail(error);
                    }
                    return ok(this);
                });
            });
        } else {
            return new Promise((ok, fail) => {
                const contents = fs.readFile(this.store, "utf8", (error, contents) => {
                    if (error) {
                        return fail(error);
                    }
                    try {
                        const data = JSON.parse(contents);
                        const dataTransformed = deleter(data, selector);
                        let contentsTransformed = undefined;
                        if (this.settings.beautify) {
                            contentsTransformed = JSON.stringify(dataTransformed, null, 4);
                        } else {
                            contentsTransformed = JSON.stringify(dataTransformed);
                        }
                        fs.writeFile(this.store, contentsTransformed, "utf8", (error) => {
                            if (error) {
                                return fail(error);
                            }
                            return ok(dataTransformed);
                        })
                    } catch (error) {
                        return fail(error);
                    }
                });
            });
        }
    };
    this.getSync = (selector, defaultValue = undefined) => {
        const data = JSON.parse(fs.readFileSync(this.store).toString());
        return getter(data, selector, defaultValue);
    };
    this.get = (selector, defaultValue = undefined) => {
        return new Promise((ok, fail) => {
            return fs.readFile(this.store, "utf8", (error, contents) => {
                if (error) {
                    return fail(error);
                }
                try {
                    const data = JSON.parse(contents);
                    const item = getter(data, selector, defaultValue);
                    return ok(item);
                } catch (error) {
                    return fail(error);
                }
            });
        });
    };
    this.setSync = (selector, value, force = false) => {
        const contents = fs.readFileSync(this.store).toString();
        const data = JSON.parse(contents);
        const dataTransformed = setter(data, selector, value, force);
        if (this.settings.beautify) {
            const contentsTransformed = JSON.stringify(dataTransformed, null, 4);
            fs.writeFileSync(this.store, contentsTransformed, "utf8");
        } else {
            const contentsTransformed = JSON.stringify(dataTransformed);
            fs.writeFileSync(this.store, contentsTransformed, "utf8");
        }
        return dataTransformed;
    };
    this.set = (selector, value, force = false) => {
        return new Promise((ok, fail) => {
            const contents = fs.readFile(this.store, "utf8", (error, contents) => {
                if (error) {
                    return fail(error);
                }
                try {
                    const data = JSON.parse(contents);
                    const dataTransformed = setter(data, selector, value, force);
                    let contentsTransformed = undefined;
                    if (this.settings.beautify) {
                        contentsTransformed = JSON.stringify(dataTransformed, null, 4);
                    } else {
                        contentsTransformed = JSON.stringify(dataTransformed);
                    }
                    fs.writeFile(this.store, contentsTransformed, "utf8", (error) => {
                        if (error) {
                            return fail(error);
                        }
                        return ok(dataTransformed);
                    })
                } catch (error) {
                    return fail(error);
                }
            });
        });
    };
    Object.assign(this, extensions);
    return this;
};
Object.assign(JSONStoreFactory, {
    getter,
    setter,
    deleter
});
module.exports = JSONStoreFactory;