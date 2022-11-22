import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {NgbModalModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {PlayerService} from './player/player.service';
import {AlarmClockService} from './alarm-clock/alarm-clock.service';
import {WebRadioService} from './web-radio/web-radio.service';

import {AppComponent} from './app.component';
import {HomepageComponent} from './homepage/homepage.component';
import {WebRadioComponent} from './web-radio/web-radio.component';
import {AlarmClockComponent} from './alarm-clock/alarm-clock.component';
import {VolumeService} from './homepage/volume.service';

@NgModule({
    declarations: [
        AppComponent,
        HomepageComponent,
        WebRadioComponent,
        AlarmClockComponent,
    ],
    imports: [
        NgbModule,
        NgbModalModule,
        BrowserModule,
        FormsModule,
        HttpClientModule,
        RouterModule.forRoot([
            {
                path: '',
                component: HomepageComponent
            },
            {
                path: 'homepage',
                component: HomepageComponent
            },
            {
                path: 'webRadio',
                component: WebRadioComponent
            },
            {
                path: 'alarm',
                component: AlarmClockComponent
            }
        ], {})
    ],
    providers: [WebRadioService, AlarmClockService, PlayerService, VolumeService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
