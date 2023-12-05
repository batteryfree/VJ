const server = require('http').createServer();
const param = { cors: { origin: '*' } }
const io = require('socket.io')(server, param);

const { SerialPort } = require('serialport');
const fs = require('fs');

const { getMessagePrint, getMessageClient, getClearMesClient, getClearMesPrint } = require('./lib/creatre-message');
const { getStartData } = require('./lib/load-start-data');

let socketConetion = null;
let dataPrint = getStartData();
const PORT_SETTINGS = require('./settings/settings-port.json');
let portPrinter, portWeight;


io.on('connection', socket => {
    socketConetion = socket;
    socketConetion.emit('dataPrint', dataPrint);
    socketConetion.emit('message', getMessageClient(dataPrint));
    socketConetion.on('run', data => {
        dataPrint = data;
        dataPrint.is_start ? openPort() : closePort();
    });
});

const openPort = () => {
    portWeight = new SerialPort(PORT_SETTINGS.port_weight, (err) => {
        if (!err) {
            portPrinter = new SerialPort(PORT_SETTINGS.port_printer, (err) => {
                if (!err) {
                    socketConetion.emit('message', getClearMesClient());
                    clearPrinter();
                    if (dataPrint.is_start) {
                        readPortWeight();

                    }
                } else {
                    socketConetion.emit('message', 'Помилка відкриття порту принтера.');
                }
            });
        } else { socketConetion.emit('message', 'Помилка відкриття порту вагів.'); }
    });
}

const closePort = () => {

    if (dataPrint.is_start) {
        try {
            portWeight.close();
            portPrinter.close();
            portWeight = null;
            serialPort2 = null;
            portPrinter.emit('dataPrint', dataPrint);
        } catch (err) {
            socketConetion.emit('message', 'Помилка закриття портів.');
        }
    }
    dataPrint.is_start = false;
}

const clearPrinter = () => {
    portPrinter.write(getClearMesPrint(), (err) => {
        if (err) {
            closePort();
            socketConetion.emit('message', 'Помилка очищення завдань принтера!\rПомилка порту принтора.');
        };
    });
}

const readPortWeight = () => {
    portWeight.on('data', (data) => {
        dataPrint.weight = data.toString().substring(7, 12);
        sendToPrinter();
    });
}

const sendToPrinter = () => {
    if (!dataPrint.is_start) {
        clearPrinter();
        closePort();
        socketConetion.emit('message', 'Помилка. Відсутні дозвіл на друк'());
    } else {
        portPrinter.write(getMessagePrint(dataPrint), (err) => {
            if (!err) {
                socketConetion.emit('message', getMessageClient(dataPrint));
                dataPrint.count++;
                socketConetion.emit('dataPrint', dataPrint);
                fs.writeFileSync(`save.json`, `${JSON.stringify(dataPrint)}`, 'ascii');
            } else {
                closePort();
                socketConetion.emit('message', 'Помилка відправлення даних до принтеру.');
            }
        });
    }
}

server.listen(3030);



