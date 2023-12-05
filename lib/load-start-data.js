let getStartData = () => {
    let dataPrint;
    try {
        dataPrint = require('../save.json');
        dataPrint.is_start = false;
    } catch {
        dataPrint = require('../settings/default-data.json');
    };

    return dataPrint;
}

module.exports = { getStartData };