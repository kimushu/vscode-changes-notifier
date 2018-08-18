import * as request from "request-promise";
import * as fs from "fs";
import * as path from "path";
import * as util from "util";

const LATEST_JSON = path.join(__dirname, "latest.json");

interface TargetDescriptorFileList {
    [file: string]: TargetDescriptor[];
}

interface TargetDescriptor {
    key: string;
    line?: RegExp;
    func?: (content: string) => Promise<string> | string;
}

interface ItemsMap {
    [key: string]: string;
}

const targets: TargetDescriptorFileList = {
    ".yarnrc": [
        {
            key: "electron_ver",
            line: /^\s*target\s+"(\d+\.\d+\.\d+)"\s*$/
        },
    ],
};

function readLatestItems(): ItemsMap {
    try {
        return JSON.parse(fs.readFileSync(LATEST_JSON, "utf8"));
    } catch (reason) {
        return {};
    }
}

function writeLatestItems(items: ItemsMap): void {
    fs.writeFileSync(LATEST_JSON, JSON.stringify(items, null, 4), "utf8");
}

(async () => {
    const latestItems: ItemsMap = readLatestItems();
    const newItems: ItemsMap = {};

    for (let file in targets) {
        const descs = targets[file];
        const content: string = await request(`https://raw.githubusercontent.com/Microsoft/vscode/master/${file}`);
        for (let index = 0; index < descs.length; ++index) {
            const target = descs[index];
            if (target.line != null) {
                content.split("\n").forEach((line) => {
                    const match = line.match(target.line);
                    if (match != null) {
                        newItems[target.key] = match.slice(1).join(", ");
                    }
                });
            } else if (target.func != null) {
                const value = await Promise.resolve(target.func(content));
                if (value != null) {
                    newItems[target.key] = value;
                }
            }
        }
    }

    for (let key in latestItems) {
        const expected = latestItems[key];
        const actual = newItems[key];
        if (expected !== actual) {
            console.error(`[${key}] ${util.inspect(expected)} => ${util.inspect(actual)}`);
        }
    }

    writeLatestItems(newItems);
})()
.catch((reason) => {
    console.error(reason);
});
