import {GlobalVariable} from '../globals';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {WebRadio} from './web-radio';

@Injectable()
export class WebRadioService {

    baseUrl: string = GlobalVariable.BASE_API_URL;

    constructor(private httpService: HttpClient) {
    }

    getAllWebRadios(): Observable<WebRadio[]> {
        return this.httpService.get<WebRadio[]>(this.baseUrl + '/webRadio');
    }

    addWebRadio(webRadio: WebRadio): Observable<WebRadio> {
        console.log('addWebRadio');
        const body = JSON.stringify(webRadio);
        return this.httpService.post<WebRadio>(this.baseUrl + '/webRadio', body, {
            headers: new HttpHeaders().set('Content-Type', 'application/json')
        });
    }

    deleteWebRadioById(id: number): Observable<any> {
        console.log('call delete service, delete webRadio id ' + id);
        return this.httpService.delete(this.baseUrl + '/webRadio/' + id);
    }

    updateWebRadioById(id: number, values: any = {}): Observable<WebRadio> {
        const body = JSON.stringify(values);
        return this.httpService.put<WebRadio>(this.baseUrl + '/webRadio/' + id, body, {
            headers: new HttpHeaders().set('Content-Type', 'application/json'),
        });
    }
}
