"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./logger");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
let getBinary = require("youtube-dl/lib/get-binary");
let downloader = require("youtube-dl/lib/downloader");
async function updateYoutubeDl() {
    logger_1.sendToConsoleOutput("Updating youtube-dl", "loading");
    console.log(getBinary());
    const binDir = path_1.default
        .dirname(getBinary())
        .replace("app.asar", "app.asar.unpacked");
    if (fs_1.default.existsSync(binDir)) {
        fs_1.default.unlinkSync(binDir);
    }
    await new Promise((resolve, reject) => {
        downloader(binDir, function error(err, done) {
            if (err) {
                console.log("error: ", err);
                return reject(err);
            }
            console.log("done updating", done);
            logger_1.sendToConsoleOutput(`youtube-dl updated at ${binDir}`, "success");
            resolve();
        });
    });
}
exports.updateYoutubeDl = updateYoutubeDl;
