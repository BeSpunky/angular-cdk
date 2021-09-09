import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

export type TikerMap = Map<string, User>

@Injectable({
    providedIn: 'root'
})
export class UserService
{
    getActiveEnvironmentTikers(): Observable<User[]>
    {
        return of([
            new User('RANGERDANGER', 'Shy Agam', 'us@bespunky.io', '12345678-9'),
            new User('MUFFINLOVER', 'Chris Keissling', 'chris@bespunky.io', '98765432-1'),
        ]);
    }
}
