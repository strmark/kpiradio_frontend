import {GlobalVariable} from '../globals';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable()
export class VolumeService {

    baseUrl: string = GlobalVariable.BASE_API_URL;

    constructor(private httpService: HttpClient) {
    }

    volumeDown() {
        return this.httpService.post(this.baseUrl + '/volumeDown', "", {
            headers: new HttpHeaders().set('Content-Type', 'application/json'),
        });
    }

    volumeUp() {
        return this.httpService.post(this.baseUrl + '/volumeUp', "", {
            headers: new HttpHeaders().set('Content-Type', 'application/json'),
        });
    }
}
