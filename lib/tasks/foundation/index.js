"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var balm_1 = __importDefault(require("./balm"));
var balm_style_1 = __importDefault(require("./balm_style"));
var TIME_FLAG = 'BalmJS Time';
BalmJS.TIME_FLAG = TIME_FLAG;
BalmJS.BalmTask = balm_1.default;
BalmJS.BalmStyleTask = balm_style_1.default;
BalmJS.tasks = []; // Maintasks
BalmJS.recipes = []; // Subtasks
BalmJS.recipeIndex = 0;
BalmJS.server = null;
BalmJS.watchFtpFile = '';
BalmJS.watching = false;
