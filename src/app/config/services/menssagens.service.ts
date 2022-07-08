import { Injectable } from '@angular/core';

import Swal from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class MenssageService {
   
    constructor() {
    }

    public msgSuccess (titleO: string, msgO: string) {
        var title = 'Sucesso';
        var msg = '';
        if (titleO) {
            title = titleO;
        }
        if (msgO) {
            msg = msgO;
        }
        Swal.fire({
            title: title,
            text: msg,
            icon: 'success',
            confirmButtonText: "OK"
          });
    }

    public msgWarning (titleO: string, msgO: string) {
        var title = 'Atenção';
        var msg = '';
        if (titleO) {
            title = titleO;
        }
        if (msgO) {
            msg = msgO;
        }
        Swal.fire({
            title: title,
            text: msg,
            icon: 'warning',
            confirmButtonText: "OK"
          });
    }

    public msgError (titleO: string, msgO: string) {
        var title = 'Erro';
        var msg = '';
        if (titleO) {
            title = titleO;
        }
        if (msgO) {
            msg = msgO;
        }
        Swal.fire({
            title: title,
            text: msg,
            icon: 'error',
            confirmButtonText: "OK"
          });
    }

    public msgInfo (titleO: string, msgO: string) {
        var title = 'Informação';
        var msg = '';
        if (titleO) {
            title = titleO;
        }
        if (msgO) {
            msg = msgO;
        }
        Swal.fire({
            title: title,
            text: msg,
            icon: 'info',
            confirmButtonText: "OK"
          });
    }


}