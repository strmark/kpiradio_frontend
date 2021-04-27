import {Volume} from '../homepage/volume';
import {GlobalVariable} from './../globals';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';

@Injectable()
export class VolumeService {

    baseUrl: string = GlobalVariable.BASE_API_URL;

    constructor(private httpService: HttpClient) {
    }

    getVolume(): Observable<Volume> {
        return this.httpService.get<Volume>(this.baseUrl + "/volume/");
    }

    setVolume(volume: Volume): Observable<Volume> {
        let body = JSON.stringify(volume); // Stringify payload
        return this.httpService.post<Volume>(this.baseUrl + "/volume/", body, {
            headers: new HttpHeaders().set('Content-Type', 'application/json'),
        });
    }

}
