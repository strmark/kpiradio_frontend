export class Player {
    status = 'off';
    webRadio: number;

    constructor(values: any = {}) {
        Object.assign(this, values);
    }
}
