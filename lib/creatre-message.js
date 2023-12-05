const addZero = (count) => {
    let result = count.toString();
    let amount = result.length;
    for (let i = 0; i < amount; i++) {
        result = '0' + result;
    }

    return result;
}

const getMessagePrint = (dataPrint) => {
    let count = addZero(dataPrint.count);
    let result = `JDA|S=${dataPrint.mark_mouns}|DP=${dataPrint.date_prod}|DS=${dataPrint.date_exp}|S1=${dataPrint.text1}|` +
        `S2=${dataPrint.text2}|C=${count}|W=${dataPrint.weight}|WT=${dataPrint.text3}|S3=${dataPrint.text4}|N=${dataPrint.num.toString()}|\r`;

    return result;
}

const getMessageClient = (dataPrint) => {
    let count = addZero(dataPrint.count);
    let result = `${dataPrint.mark_mouns} ${dataPrint.date_prod} / ${dataPrint.date_exp} ${dataPrint.text1} ${dataPrint.text2} ${count}` +
        ` ${dataPrint.weight} ${dataPrint.text3} ${dataPrint.text4} ${dataPrint.num.toString()}`;

    return result;
}

const getClearMesPrint = () => {
    return `JDA|S= |DP= |DS= |S1= |S2= |C= |W= |WT= |S3= |N= |\r`;
}

const getClearMesClient = () => {
    return 'X 00.00 / 00.0000 XX XX 0000 00.00 KG XX 0';
}


module.exports = { getMessagePrint, getMessageClient, getClearMesClient, getClearMesPrint };