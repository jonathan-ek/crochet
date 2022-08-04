// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const {SerialPort} = require('serialport')
const {ReadlineParser} = require('@serialport/parser-readline')

const patternsFolder = './patterns/';
const fs = require('fs');
const {parse} = require("./parser");
const crochet = {};
window.crochet = crochet;
crochet.selectPattern = (pattern, callback) => {
    fs.readFile(`${patternsFolder}${pattern}`, 'utf8', (err, data) => {
        if (err) {
            callback(undefined, err)
            return;
        }
        callback(parse(data), undefined);
    });
}
crochet.getPatterns = () => {
    const patterns = [];
    fs.readdirSync(patternsFolder).forEach(file => {
        if (file.endsWith('.cro')) {
            patterns.push(file);
        }
    });
    return patterns;
}

const pollSerialPorts = async (eventHandler) => {
    await SerialPort.list().then((ports, err) => {
        if (err) {
            serial.err = err.message
            return
        }

        if (ports.length === 0) {
            serial.err = 'No ports discovered'
        }
        const port_info = ports.filter((port) => port.vendorId === "2e8a" && port.productId === '0005')[0];
        const port = new SerialPort({path: port_info.path, baudRate: 115200})
        const parser = port.pipe(new ReadlineParser({delimiter: '\r\n'}))
        let prevState = [0,0,0,0,0]
        const handler = (dataStr) => {
            const data = JSON.parse(dataStr);
            const mapping = {
                0: 'topRight',
                1: 'topMiddle',
                2: 'topLeft',
                3: 'left',
                4: 'right',
            }
            data.forEach((val, index) => {
                if (val !== prevState[index]) {
                    eventHandler({key: mapping[index], state: val});
                }
            })
            prevState = data;
        }
        parser.on('data', handler)
    })
}
crochet.connectPedal = pollSerialPorts


const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('mydb.db');

db.serialize(function() {
    db.run(
        "CREATE TABLE if not exists saves (id INTEGER PRIMARY KEY AUTOINCREMENT, pattern TEXT, part TEXT, rowIndex INTEGER, stitchIndex INTEGER, timestamp INTEGER)");

    crochet.save = (pattern, part, rowIndex, stitchIndex) => {
        const stmt = db.prepare("INSERT INTO saves (pattern, part, rowIndex, stitchIndex, timestamp) VALUES (?, ?, ?, ?, ?)");
        stmt.run(pattern, part, rowIndex, stitchIndex, new Date().valueOf()).finalize();
    }
    crochet.fetchSaves = (pattern=null, cb) => {
        if (pattern) {
            console.log(pattern)
            db.all("SELECT * FROM saves where pattern = ? order by timestamp desc LIMIT 10", pattern, (err, row) => {
                cb(row);
            });
        } else {
            db.all("SELECT * FROM saves order by timestamp desc LIMIT 10", (err, row) => {
                cb(row);
            });
        }
    }
    crochet.closeDB = () => {
        db.close();
    }
});

