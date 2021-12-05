import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {WebRadio} from './web-radio';
import {Player} from '../player/player';
import {PlayerService} from '../player/player.service';
import {WebRadioService} from './web-radio.service';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-web-radio',
    templateUrl: './web-radio.component.html',
    styleUrls: ['./web-radio.component.css']
})
export class WebRadioComponent implements OnInit {

    constructor(private webRadioService: WebRadioService,
                private playerService: PlayerService,
                private router: Router,
                private modalService: NgbModal
    ) {
    }

    closeResult: string;

    newWebRadio: boolean;
    webradio: WebRadio;
    webradios: WebRadio[] = [];
    webRadioToDelete: WebRadio;

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
        this.refreshWebRadioList();
    }

    deleteWebRadio(webRadioToDelete: WebRadio): void {
        console.log('Deleting' + webRadioToDelete);
        this.webRadioService.deleteWebRadioById(webRadioToDelete.id).subscribe(() => this.refreshWebRadioList(),
            error => console.log('error: ' + error));
    }

    confirmDeleteWebRadio(confDel, webradio: WebRadio): void {
        console.log('confirmDeleteWebRadio clicked');
        this.webRadioToDelete = webradio;
        this.modalService.open(confDel, {ariaLabelledBy: 'modal-title'}).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
            if (result === 'yes click') {
                console.log('Closed  with ' + this.closeResult);
                this.deleteWebRadio(this.webRadioToDelete);
            }
        }, (reason) => {
            this.closeResult = `Dismissed ${WebRadioComponent.getDismissReason(reason)}`;
            console.log('Dismissed with ${result}');
        });
    }

    setWebRadios(webradios: WebRadio[]): void {
        console.log(webradios);
        this.webradios = webradios;
    }

    refreshWebRadioList(): void {
        console.log('Ververs de web radio list');
        this.webRadioService.getAllWebRadios().subscribe(this.setWebRadios.bind(this));
    }

    playWebRadio(webradio: WebRadio): void {
        console.log('Speel web radio id ' + webradio.id);
        const player = new Player();
        player.status = 'on';
        player.webradio = webradio.id;
        this.playerService.updatePlayer(player).subscribe(
            () => {
                this.router.navigate(['homepage']);
            },
            error => console.log('Error ' + error)
        );
    }

    save(): void {
        console.log('web-radio form: save clicked');
        if (this.newWebRadio) {
            console.log('Create new web radio');
            console.log(this.webradio);
            this.webRadioService.addWebRadio(this.webradio).subscribe(
                () => {
                    this.refreshWebRadioList();
                },
                error => console.log('Error ' + error)
            );
        } else {
            console.log('web-radio form: webradio with id ' + this.webradio.id + ' already exist. Call update service');
            this.webRadioService.updateWebRadioById(this.webradio.id, this.webradio).subscribe(
                () => {
                    this.refreshWebRadioList();
                },
                error => console.log('Error ' + error)
            );
        }
        this.newWebRadio = false;
        this.webradio = null;
    }

    open(content, webradio: WebRadio): void {
        if (webradio == null) {
            this.webradio = new WebRadio();
            this.newWebRadio = true;
        } else {
            this.webradio = webradio;
            this.newWebRadio = false;
        }
        this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
            if (result === 'Save click') {
                console.log('Closed  with ' + this.closeResult);
                this.save();
            }

        }, (reason) => {
            this.closeResult = `Dismissed ${WebRadioComponent.getDismissReason(reason)}`;
            console.log('Dismissed with ${result}');
        });
    }

}
