"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var request = require("request-promise");
var fs = require("fs");
var path = require("path");
var util = require("util");
var LATEST_JSON = path.join(__dirname, "latest.json");
var targets = {
    ".yarnrc": [
        {
            key: "electron_ver",
            line: /^\s*target\s+"(\d+\.\d+\.\d+)"\s*$/
        },
    ],
};
function readLatestItems() {
    try {
        return JSON.parse(fs.readFileSync(LATEST_JSON, "utf8"));
    }
    catch (reason) {
        return {};
    }
}
function writeLatestItems(items) {
    fs.writeFileSync(LATEST_JSON, JSON.stringify(items, null, 4), "utf8");
}
(function () { return __awaiter(_this, void 0, void 0, function () {
    var latestItems, newItems, _a, _b, _i, file, descs, content, _loop_1, index, key, expected, actual;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                latestItems = readLatestItems();
                newItems = {};
                _a = [];
                for (_b in targets)
                    _a.push(_b);
                _i = 0;
                _c.label = 1;
            case 1:
                if (!(_i < _a.length)) return [3 /*break*/, 7];
                file = _a[_i];
                descs = targets[file];
                return [4 /*yield*/, request("https://raw.githubusercontent.com/Microsoft/vscode/master/" + file)];
            case 2:
                content = _c.sent();
                _loop_1 = function (index) {
                    var target, value;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                target = descs[index];
                                if (!(target.line != null)) return [3 /*break*/, 1];
                                content.split("\n").forEach(function (line) {
                                    var match = line.match(target.line);
                                    if (match != null) {
                                        newItems[target.key] = match.slice(1).join(", ");
                                    }
                                });
                                return [3 /*break*/, 3];
                            case 1:
                                if (!(target.func != null)) return [3 /*break*/, 3];
                                return [4 /*yield*/, Promise.resolve(target.func(content))];
                            case 2:
                                value = _a.sent();
                                if (value != null) {
                                    newItems[target.key] = value;
                                }
                                _a.label = 3;
                            case 3: return [2 /*return*/];
                        }
                    });
                };
                index = 0;
                _c.label = 3;
            case 3:
                if (!(index < descs.length)) return [3 /*break*/, 6];
                return [5 /*yield**/, _loop_1(index)];
            case 4:
                _c.sent();
                _c.label = 5;
            case 5:
                ++index;
                return [3 /*break*/, 3];
            case 6:
                _i++;
                return [3 /*break*/, 1];
            case 7:
                for (key in latestItems) {
                    expected = latestItems[key];
                    actual = newItems[key];
                    if (expected !== actual) {
                        console.error("[" + key + "] " + util.inspect(expected) + " => " + util.inspect(actual));
                    }
                }
                writeLatestItems(newItems);
                return [2 /*return*/];
        }
    });
}); })()
    .catch(function (reason) {
    console.error(reason);
});
