import {Component, OnInit} from '@angular/core';
import {AlarmClockService} from './alarm-clock.service';
import {AlarmClock} from './alarm-clock';
import {WebRadio} from '../web-radio/web-radio';
import {WebRadioService} from '../web-radio/web-radio.service';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-alarm-clock',
    templateUrl: './alarm-clock.component.html',
    styleUrls: ['./alarm-clock.component.css'],
    standalone: false
})
export class AlarmClockComponent implements OnInit {

    constructor(private alarmClockService: AlarmClockService,
                private webRadioService: WebRadioService,
                private modalService: NgbModal
    ) {
        this.webRadioService.getAllWebRadios().subscribe(this.setWebRadios.bind(this));
        this.maxAutoStopMinute = this.create_range(180);
    }

    closeResult: string;

    alarmClock: AlarmClock;
    alarmClocks: AlarmClock[] = [];
    webRadios: WebRadio[] = [];

    timePicker = {hour: 12, minute: 30};

    maxAutoStopMinute: number[];

    newAlarmClock: boolean;
    alarmClockToDelete: AlarmClock;

    private static getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }

    ngOnInit(): void {
        this.refreshAlarmClockList();
    }

    create_range(maxVal: number): number[] {
        const x = [];
        let i: number;
        for (i = 0; i <= maxVal; i++) {
            x.push(i);
        }
        return x;
    }

    setWebRadios(webRadios: WebRadio[]): void {
        console.log(webRadios);
        this.webRadios = webRadios;
    }

    deleteAlarmClock(alarmClock): void {
        this.alarmClockService.deleteAlarmClockById(alarmClock.id).subscribe({
            next: () => this.refreshAlarmClockList(),
            error: error => console.log('error: ' + error)
        });
    }

    confirmDeleteAlarmClock(confDel, alarmClock: AlarmClock): void {
        console.log('confirmDeleteAlarmClock clicked');
        this.alarmClockToDelete = alarmClock;
        this.modalService.open(confDel, {ariaLabelledBy: 'modal-title'}).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
            if (result === 'yes click') {
                console.log('Closed  with ' + this.closeResult);
                this.deleteAlarmClock(this.alarmClockToDelete);
            }
        }, (reason) => {
            this.closeResult = `Dismissed ${AlarmClockComponent.getDismissReason(reason)}`;
            console.log('Dismissed with ${result}');
        });
    }

    setAlarmClocks(alarmClocks: AlarmClock[]): void {
        this.alarmClocks = alarmClocks;
    }

    refreshAlarmClockList(): void {
        this.alarmClockService.getAllAlarmClocks().subscribe(this.setAlarmClocks.bind(this));
    }

    switchActiveAlarmClock(alarmClock: AlarmClock): void {
        alarmClock.isActive = !alarmClock.isActive;
        this.alarmClockService.updateAlarmClockById(alarmClock.id, alarmClock).subscribe({
            next: () => this.refreshAlarmClockList(),
            error: error => console.log('Error ' + error)
        });
    }

    save(): void {
        console.log('Alarm Clock: save clicked');
        if (this.newAlarmClock) {
            console.log('Create new alarm clock');
            this.alarmClock.hour = this.timePicker.hour;
            this.alarmClock.minute = this.timePicker.minute;
            this.alarmClock.isActive = true;
            console.log(this.alarmClock);
            this.alarmClockService.addAlarmClock(this.alarmClock).subscribe({
                next: () => this.refreshAlarmClockList(),
                error: error => console.log('Error ' + error)
            });
        } else {
            console.log('alarm clock: alarm clock with id ' + this.alarmClock.id + ' already exist. Call update service');
            this.alarmClock.hour = this.timePicker.hour;
            this.alarmClock.minute = this.timePicker.minute;

            this.alarmClockService.updateAlarmClockById(this.alarmClock.id, this.alarmClock).subscribe({
                next: () => this.refreshAlarmClockList(),
                error: error => console.log('Error ' + error)
            });
        }

        this.newAlarmClock = false;
        this.alarmClock = null;
    }

    open(content, alarmClock: AlarmClock): void {
        if (alarmClock == null) {
            this.newAlarmClock = true;
            this.alarmClock = new AlarmClock();
            this.timePicker = {hour: 12, minute: 30};
            this.alarmClock.autoStopMinutes = 180;
        } else {
            this.newAlarmClock = false;
            this.alarmClock = alarmClock;
            this.timePicker.hour = this.alarmClock.hour;
            this.timePicker.minute = this.alarmClock.minute;
        }
        this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
            if (result === 'Save click') {
                console.log('Closed  with ' + this.closeResult);
                this.save();
            }
        }, (reason) => {
            this.closeResult = `Dismissed ${AlarmClockComponent.getDismissReason(reason)}`;
            console.log('Dismissed with ${result}');
        });
    }
}
