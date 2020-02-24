import { Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  constructor(private _snackBar: MatSnackBar) { }

  showToast(message: string, type: string) {
    this._snackBar.open(message, 'X',{
      duration: 3000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      panelClass: [type]
    });
  }
}
