export class AlarmClock {
    id: number;
    name: string = '';
    monday: boolean = false;
    tuesday: boolean = false;
    wednesday: boolean = false;
    thursday: boolean = false;
    friday: boolean = false;
    saturday: boolean = false;
    sunday: boolean = false;
    hour: number;
    minute: number;
    autoStopMinutes: number;
    isActive: boolean = false;
    webradio: number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}