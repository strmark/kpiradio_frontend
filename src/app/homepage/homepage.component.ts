import {Component, OnInit} from '@angular/core';
import {AlarmClock} from '../alarm-clock/alarm-clock';
import {AlarmClockService} from '../alarm-clock/alarm-clock.service';
import {Player} from '../player/player';
import {PlayerService} from '../player/player.service';
import {WebRadio} from '../web-radio/web-radio';
import {WebRadioService} from '../web-radio/web-radio.service';
import {VolumeService} from './volume.service';
import {Volume} from "./volume";

@Component({
    selector: 'app-homepage',
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

    clock: number;
    active_webradios: any[];
    active_alarms: AlarmClock[];
    all_webradios: any[];
    player: Player;
    playerLoaded: boolean = false;
    volumeLoaded: boolean = false;
    currentVolume: Volume = new Volume(70);

    constructor(private webRadioService: WebRadioService,
                private playerService: PlayerService,
                private alarmClockService: AlarmClockService,
                private volumeService: VolumeService) {
        setInterval(() => {
            this.clock = Date.now();
        }, 1);
    }

    ngOnInit() {
        // get the active web radio
        this.webRadioService.getAllWebRadios().subscribe(this.filterDefaultWebRadio.bind(this));
        // get the player status
        this.playerService.getPlayerStatus().subscribe(this.setPlayerStatus.bind(this));
        // get the list of activated Alarm
        this.alarmClockService.getAllAlarmClocks().subscribe(this.setActiveAlarmClocks.bind(this));
        // get the current volume
        this.refreshVolume();
    }

    filterDefaultWebRadio(webradios: WebRadio[]) {
        this.all_webradios = webradios;
        console.log(webradios);
        this.active_webradios = this.all_webradios.filter(
            webradio => webradio.default === true
        )
    }

    setPlayerStatus(player: Player) {
        console.log("Player: " + player);
        this.player = player;
        this.playerLoaded = true;
    }

    switchPlayerStatus(status: string) {
        this.player.status = status;
        this.playerService.updatePlayer(this.player).subscribe(this.setPlayerStatus.bind(this));
    }

    setActiveAlarmClocks(alarmclocks: AlarmClock[]) {
        this.active_alarms = alarmclocks.filter(
            alarms => alarms.isActive === true
        )
    }

    refreshVolume() {
        this.volumeService.getVolume().subscribe(this.setVolume.bind(this));
    }

    setVolume(volume: Volume) {
        this.currentVolume = volume;
        this.volumeLoaded = true;
    }

    reduceVolume() {
        let newVolumeLevel = this.currentVolume.volume;
        newVolumeLevel = newVolumeLevel - 2;
        if (newVolumeLevel < 0) {
            newVolumeLevel = 0;
        }
        this.currentVolume.volume = newVolumeLevel
        this.volumeService.setVolume(this.currentVolume).subscribe(
            success => this.refreshVolume(),
            error => console.log("Error " + error)
        );
    }

    increaseVolume() {
        let newVolumeLevel = this.currentVolume.volume;
        newVolumeLevel = newVolumeLevel + 2;
        if (newVolumeLevel > 100) {
            newVolumeLevel = 100;
        }
        this.currentVolume.volume = newVolumeLevel
        this.volumeService.setVolume(this.currentVolume).subscribe(
            success => this.refreshVolume(),
            error => console.log("Error " + error)
        );
    }
}
