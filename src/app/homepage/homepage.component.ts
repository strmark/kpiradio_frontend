import {Component, OnInit} from '@angular/core';
import {AlarmClock} from '../alarm-clock/alarm-clock';
import {AlarmClockService} from '../alarm-clock/alarm-clock.service';
import {Player} from '../player/player';
import {PlayerService} from '../player/player.service';
import {WebRadio} from '../web-radio/web-radio';
import {WebRadioService} from '../web-radio/web-radio.service';
import {VolumeService} from './volume.service';

@Component({
    selector: 'app-homepage',
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.css'],
    standalone: false
})
export class HomepageComponent implements OnInit {
    clock: number;
    activeWebRadios: any[];
    activeAlarms: AlarmClock[];
    allWebRadios: any[];
    player: Player;
    playerLoaded = false;

    constructor(private webRadioService: WebRadioService,
                private playerService: PlayerService,
                private alarmClockService: AlarmClockService,
                private volumeService: VolumeService) {
        setInterval(() => {
            this.clock = Date.now();
        }, 1);
    }

    ngOnInit(): void {
        this.webRadioService.getAllWebRadios().subscribe(this.filterDefaultWebRadio.bind(this));
        this.playerService.getPlayerStatus().subscribe(this.setPlayerStatus.bind(this));
        this.alarmClockService.getAllAlarmClocks().subscribe(this.setActiveAlarmClocks.bind(this));
    }

    filterDefaultWebRadio(webRadios: WebRadio[]): void {
        this.allWebRadios = webRadios;
        console.log(webRadios);
        this.activeWebRadios = this.allWebRadios.filter(
            webRadio => webRadio.default === true
        );
    }

    setPlayerStatus(player: Player): void {
        console.log('Player: ' + player);
        this.player = player;
        this.playerLoaded = true;
    }

    switchPlayerStatus(status: string): void {
        this.player.status = status;
        this.playerService.updatePlayer(this.player).subscribe(this.setPlayerStatus.bind(this));
    }

    setActiveAlarmClocks(alarmClocks: AlarmClock[]): void {
        this.activeAlarms = alarmClocks.filter(
            alarms => alarms.isActive === true
        );
    }

    reduceVolume(): void {
        this.volumeService.volumeDown().subscribe();
    }

    increaseVolume(): void {
        this.volumeService.volumeUp().subscribe();
    }
}
