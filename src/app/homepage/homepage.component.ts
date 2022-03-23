import {Component, OnInit} from '@angular/core';
import {AlarmClock} from '../alarm-clock/alarm-clock';
import {AlarmClockService} from '../alarm-clock/alarm-clock.service';
import {Player} from '../player/player';
import {PlayerService} from '../player/player.service';
import {WebRadio} from '../web-radio/web-radio';
import {WebRadioService} from '../web-radio/web-radio.service';
import {VolumeService} from './volume.service';
import {Volume} from './volume';

@Component({
    selector: 'app-homepage',
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
    clock: number;
    activeWebRadios: any[];
    activeAlarms: AlarmClock[];
    allWebRadios: any[];
    player: Player;
    playerLoaded = false;
    volumeLoaded = false;
    currentVolume: Volume = new Volume(70);

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
        this.refreshVolume();
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

    refreshVolume(): void {
        this.volumeService.getVolume().subscribe(this.setVolume.bind(this));
    }

    setVolume(volume: Volume): void {
        this.currentVolume = volume;
        this.volumeLoaded = true;
    }

    reduceVolume(): void {
        this.currentVolume.volume -= +2;
        if (this.currentVolume.volume < 0) {
            this.currentVolume.volume = 0;
        }
        this.volumeService.setVolume(this.currentVolume).subscribe({
            next: () => this.refreshVolume(),
            error: error => console.log('Error ' + error)
        });
    }

    increaseVolume(): void {
        this.currentVolume.volume = +this.currentVolume.volume + +2;
        if (+this.currentVolume.volume > +100) {
            this.currentVolume.volume = 100;
        }
        this.volumeService.setVolume(this.currentVolume).subscribe({
            next: () => this.refreshVolume(),
            error: error => console.log('Error ' + error)
        });
    }
}
