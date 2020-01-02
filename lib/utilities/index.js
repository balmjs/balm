"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = __importDefault(require("./utils"));
var logger_1 = __importDefault(require("./logger"));
var file_1 = __importDefault(require("./file"));
var namespace_1 = __importDefault(require("./namespace"));
BalmJS.utils = utils_1.default;
BalmJS.logger = logger_1.default;
BalmJS.file = file_1.default;
BalmJS.toNamespace = namespace_1.default;
