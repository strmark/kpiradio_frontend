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
    standalone: false
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
    webRadio: WebRadio;
    webRadios: WebRadio[] = [];
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
        this.webRadioService.deleteWebRadioById(webRadioToDelete.id).subscribe({
            next: () => this.refreshWebRadioList(),
            error: error => console.log('error: ' + error)
        });
    }

    confirmDeleteWebRadio(confDel, webRadio: WebRadio): void {
        console.log('confirmDeleteWebRadio clicked');
        this.webRadioToDelete = webRadio;
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

    setWebRadios(webRadios: WebRadio[]): void {
        console.log(webRadios);
        this.webRadios = webRadios;
    }

    refreshWebRadioList(): void {
        console.log('Renew the web radio list');
        this.webRadioService.getAllWebRadios().subscribe(this.setWebRadios.bind(this));
    }

    playWebRadio(webRadio: WebRadio): void {
        console.log('Play the web radio id ' + webRadio.id);
        const player = new Player();
        player.status = 'on';
        player.webRadio = webRadio.id;
        this.playerService.updatePlayer(player).subscribe({
            next: () => this.router.navigate(['homepage']).finally(),
            error: error => console.log('Error ' + error)
        });
    }

    save(): void {
        console.log('web-radio form: save clicked');
        if (this.newWebRadio) {
            console.log('Create new web radio');
            console.log(this.webRadio);
            this.webRadioService.addWebRadio(this.webRadio).subscribe({
                next: () => this.refreshWebRadioList(),
                error: error => console.log('Error ' + error)
            });
        } else {
            console.log('web-radio form: webRadio with id ' + this.webRadio.id + ' already exist. Call update service');
            this.webRadioService.updateWebRadioById(this.webRadio.id, this.webRadio).subscribe({
                next: () => this.refreshWebRadioList(),
                error: error => console.log('Error ' + error)
            });
        }
        this.newWebRadio = false;
        this.webRadio = null;
    }

    open(content, webRadio: WebRadio): void {
        if (webRadio == null) {
            this.webRadio = new WebRadio();
            this.newWebRadio = true;
        } else {
            this.webRadio = webRadio;
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
