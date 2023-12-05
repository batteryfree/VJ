class App {
    constructor(el) {
        this.el = el;
        this.initElements();
        this.dataPrint = null;
        this.initSocket();
        this.listenEvents();
        this.connected = false;

    }

    initElements() {
        this.elements = {
            markMouns: this.el.querySelector('[data-mark-mouns]'),
            dateProd: this.el.querySelector('[data-date-prod]'),
            dateExp: this.el.querySelector('[data-date-exp]'),
            text1: this.el.querySelector('[data-text1]'),
            text2: this.el.querySelector('[data-text2]'),
            count: this.el.querySelector('[data-count]'),
            text3: this.el.querySelector('[data-text3]'),
            text4: this.el.querySelector('[data-text4]'),
            num: this.el.querySelector('[data-num]'),
            btnStart: this.el.querySelector('[data-btn-start]'),
            text: this.el.querySelector('.print'),
        };
    }

    initSocket() {
        this.socket = io("http://localhost:3030");


        this.socket.io.on("error", () => {
            this.connected = false;
            this.upDataText(`ПОМИЛКА З'ЄДНАННЯ З СЕРВЕРОМ ДРУКУ!`);
        });

        this.socket.on('connect', () => {
            this.connected = true;
        });

        this.socket.on('dataPrint', data => {
            this.upDataPrint(data);
            console.log(data);
            this.upDataInputs();
            this.upDataBtnStart(this.dataPrint.is_start);
        });

        this.socket.on('message', data => {
            this.upDataText(data.toString());
        });
    }

    upDataText(text) {
        this.elements.text.innerHTML = text.toUpperCase();
        if (text.substring(0, 7).toUpperCase() === 'ПОМИЛКА') {
            this.elements.text.classList.add('print--color');
        } else {
            this.elements.text.classList.remove('print--color');
        };
    }

    upDataInputs() {
        this.elements.markMouns.value = this.dataPrint.mark_mouns;
        this.elements.dateProd.value = this.dataPrint.date_prod;
        this.elements.dateExp.value = this.dataPrint.date_exp;
        this.elements.text1.value = this.dataPrint.text1;
        this.elements.text2.value = this.dataPrint.text2;
        this.elements.count.value = this.dataPrint.count;
        this.elements.text3.value = this.dataPrint.text3;
        this.elements.text4.value = this.dataPrint.text4;
        this.elements.num.value = this.dataPrint.num;
    }

    upDataPrint(data) {
        this.dataPrint = data;
        this.dataPrint.mark_mouns = data.mark_mouns.toUpperCase();
        this.dataPrint.date_prod = data.date_prod;
        this.dataPrint.date_exp = data.date_exp;
        this.dataPrint.text1 = data.text1.toUpperCase();
        this.dataPrint.text2 = data.text2.toUpperCase();
        this.dataPrint.count = data.count;
        this.dataPrint.text3 = data.text3.toUpperCase();
        this.dataPrint.text4 = data.text4.toUpperCase();
        this.dataPrint.num = data.num;
        this.dataPrint.is_start = data.is_start;
    }

    upDataBtnStart(isStart) {
        if (isStart) {
            this.elements.btnStart.innerHTML = 'СТОП'
            this.elements.btnStart.classList.add('btn_start--color');
        } else {
            this.elements.btnStart.innerHTML = 'СТАРТ';
            this.elements.btnStart.classList.remove('btn_start--color');
        };
    }

    listenEvents() {
        this.elements.btnStart.addEventListener('click', () => {
            if (this.connected) {
                this.dataPrint.is_start = !this.dataPrint.is_start;
                this.socket.emit('run', this.dataPrint);
            }
        });
    }

}

document.addEventListener('DOMContentLoaded', () => {
    const app = new App(document.querySelector('#root'));
    console.dir(app);
});