import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class Storage {

    public getItem(id) {
        if (id) {
            return localStorage.getItem("" + id);
        }
        return "";
    }

    public setItem(id, obj) {
        if (id && obj) {
            localStorage.setItem(id + "", obj);
            return true;
        }
        return false;
    }

    public rmItem(id) {
        if (id) {
            localStorage.removeItem("" + id);
            return true;
        }
        return false;
    }

    public getLogin() {
        try {
            let jogo = this.getItem('u_web');
            if (!jogo) {
                this.setLogin({
                    login: "t",
                    senha: "t",
                    isAtivo: false,
                    blocks: {
                    }
                });
                jogo = this.getItem('u_web');
            }
            return JSON.parse(jogo);
        } catch (error) {
            return null;
        }
    }

    public setLogin(login) {
        if (login) {
            let jogo = this.setItem('u_web', JSON.stringify(login));
        }
        return;
    }


};