class App {
    constructor(el) {
        this.el = el;
        this.initElements();
        this.initSocket();
        this.listenEvents();
        this.isStart = false;
        this.isConnected = false;
        this.lastText = 'X 00.00 / 00.0000 XX XX 0000 00.00 KG XX 0';
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
        this.socket = io("http://localhost:3000");

        this.socket.io.on("error", () => {
            this.upDataText(`ПОМИЛКА З'ЄДНАННЯ З СЕРВЕРОМ!`);
            this.isConnected = false;
        });

        this.socket.on('connect', (err) => {
            if (!err) {
                this.upDataText(this.lastText);
                this.isConnected = true;
            }
        });

        this.socket.on('dataPrint', data => {
            this.upData(data);
        });

        this.socket.on('message', data => {
            this.upDataText(data.toString());
            this.lastText = data.toString();
        });
    }

    listenEvents() {
        this.elements.btnStart.addEventListener('click', () => {
            if (!this.isConnected) {
                console.log('ERROR!');
                return;
            }

        });
    }

    upData(data) {
        this.dataPrint = data;
        this.upDataInput();
        this.disabledInput(this.dataPrint.is_start);
        this.upDataBtnStart(this.dataPrint.is_start);
        this.isStart = this.dataPrint.is_start;
    }

    upDataInput() {
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

    upDataPrint() {
        this.dataPrint.mark_mouns = this.elements.markMouns.value.toUpperCase();
        this.dataPrint.date_prod = this.elements.dateProd.value.toUpperCase();
        this.dataPrint.date_exp = this.elements.dateExp.value.toUpperCase();
        this.dataPrint.text1 = this.elements.text1.value.toUpperCase();
        this.dataPrint.text2 = this.elements.text2.value.toUpperCase();
        this.dataPrint.count = this.elements.count.value
        this.dataPrint.text3 = this.elements.text3.value.toUpperCase();
        this.dataPrint.text4 = this.elements.text4.value.toUpperCase();
        this.dataPrint.num = this.elements.num.value;
    }

    upDataBtnStart(isStart) {
        if (isStart) {
            this.elements.btnStart.innerHTML = 'СТОП'
            this.elements.btnStart.classList.add('btn_start--color');
        } else {
            this.elements.btnStart.innerHTML = 'СТАРТ';
            this.elements.btnStart.classList.remove('btn_start--color');
        }
    }

    upDataText(text) {
        this.elements.text.innerHTML = text;
        if (text.substring(0, 7).toUpperCase() === 'ПОМИЛКА') {
            this.elements.text.classList.add('print--color');
        } else {
            this.elements.text.classList.remove('print--color');
        }
    }

    disabledInput(isDisabled) {
        let disable = isDisabled;
        this.elements.markMouns.disabled = disable;
        this.elements.dateProd.disabled = disable;
        this.elements.dateExp.disabled = disable;
        this.elements.text1.disabled = disable;
        this.elements.text2.disabled = disable;
        this.elements.count.disabled = disable;
        this.elements.text3.disabled = disable;
        this.elements.text4.disabled = disable;
        this.elements.num.disabled = disable;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new App(document.querySelector('#root'));
    console.dir(app);
});


