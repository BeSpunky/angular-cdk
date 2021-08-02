import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserService
{
    getAllEnvironmentTikers(): Observable<User[]>
    {
        return of([
            new User('RANGERDANGER', 'Shy Agam', 'us@bespunky.io', '12345678-9'),
            new User('MUFFINLOVER', 'Chris Keissling', 'chris@bespunky.io', '98765432-1'),
        ]);
    }
}
