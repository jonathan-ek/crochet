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


//
// async function listSerialPorts() {
//     await SerialPort.list().then((ports, err) => {
//         if (err) {
//             document.getElementById('error').textContent = err.message
//             return
//         } else {
//             document.getElementById('error').textContent = ''
//         }
//
//         if (ports.length === 0) {
//             document.getElementById('error').textContent = 'No ports discovered'
//         }
//         const port_info = ports.filter((port) => port.vendorId === "2e8a" && port.productId === '0005')[0];
//         console.log('ports', port_info.path);
//         document.getElementById('ports').innerHTML = port_info.path;
//
//         const port = new SerialPort({path: port_info.path, baudRate: 115200})
//
//         const parser = port.pipe(new ReadlineParser({delimiter: '\r\n'}))
//         parser.on('data', console.log)
//     })
// }
//
// listSerialPorts()
