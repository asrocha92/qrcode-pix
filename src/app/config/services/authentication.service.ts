import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { environment } from './../../../environments/environment';
import Swal from 'sweetalert2';
import { User } from './../../config/models';
import * as $ from 'jquery';
import * as CryptoJS from 'crypto-js';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    public getLoggedInName = new Subject();

    constructor(private http: HttpClient, private router: Router) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('u_jg')));
        this.currentUser = this.currentUserSubject.asObservable();
        if (this.currentUser && this.currentUser['isAtivo']) {
            this.router.navigate(["/"]);
        }
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    public rm() {
        this.logout();
        return;
    }

    login(args: Object) {
        try {
            this.loading(true);
            return this.http.post<any>(`${environment.apiUrl}`, args)
                .pipe(map(data => {
                    this.onComplete(data, args);
                    var user = null;
                    if (args['login'] && args['senha']) {
                        user = { login: args['login'], senha: args['senha'] };
                    }
                    // login successful if there's a jwt token in the response
                    if (data && data.success && user) {
                        // store user details and jwt token in local storage to keep user logged in between page refreshes
                        localStorage.setItem('currentUserAluno', JSON.stringify(user));
                        this.getLoggedInName.next('Aluno > (Home)');
                        this.currentUserSubject.next(data);
                    } else {
                        this.onError(data);
                        this.logout();
                    }
                    return data;
                }, error => {
                    this.onComplete(error, args);
                    this.onError(error);
                }));
        } catch (error) {
            ////console.log(error);
            this.falhaInesperada();
        }
    }

    logout() {
        try {
            // remove user from local storage to log user out
            localStorage.removeItem('currentUserAluno');
            this.currentUserSubject.next(null);
            this.getLoggedInName.next('Login / Cadastre-se');
        } catch (error) {
            ////console.log(error);
            this.falhaInesperada();
        }
    }

    requisitarPost(args: Object) {
        try {
            return this.post(args);
        } catch (error) {
            this.falhaInesperada();
            this.router.navigate(["/cadastra-se"]);
        }
    }

    post(args: Object) {
        try {
            this.loading(true);
            
            console.log('authentication.js');
            console.log(args);
            var objEncrypt = {
                data: this.ecrype(args)
            };

            return this.http.post<any>(`${environment.apiUrl}`, JSON.stringify(objEncrypt))
                .pipe(
                    tap( // Log the result or error
                        data => {
                            this.onComplete(data, args);
                            //console.log(data);
                            if (data && data.data) {
                                data.data = this.descrype(data.data);
                                console.log(data);
                            }
                            return data;
                        },
                        error => {
                            this.falhaInesperada();
                        }
                      ),
                    map(data => {
                    this.onComplete(data, args);
                    //console.log(data);
                    if (data && data.data) {
                        data.data = this.descrype(data.data);
                        console.log(data);
                    }
                    return data;
                }, error => {
                    this.onError(error);
                }));
        } catch (error) {
            console.log(error);
            this.falhaInesperada();
        }
    }

    get(args: Object) {
        try {
            this.loading(true);
            return this.http.get<any>(`${environment.apiUrl}`, args)
                .pipe(map(data => {
                    this.onComplete(data, args);
                    return data;
                }, error => {
                    this.onError(error);
                }));
        } catch (error) {
            ////console.log(error);
            this.falhaInesperada();
        }
    }

    onComplete(data, args: Object) {
        try {
            this.loading(false);
            if (data && data.error) {
                Swal.fire({
                    title: 'Falha',
                    text: data.message,
                    icon: 'warning',
                    confirmButtonText: "OK"
                });
            }
            if (data && data.success && args && !args['not_msg']) {
                Swal.fire({
                    title: 'Sucesso',
                    text: data.message,
                    icon: 'success',
                    confirmButtonText: "OK"
                });
            }
        } catch (error) {
            ////console.log(error);
            this.falhaInesperada();
        }
    };

    loading(loand) {
        try {
            if (loand) {
                $(function () {
                    $("#loader").removeClass("display-off").addClass("display-on");
                });
            } else {
                $(function () {
                    $("#loader").removeClass("display-on").addClass("display-off");
                });
            }
        } catch (error) {
            ////console.log(error);
            this.falhaInesperada();
        }
    }

    falhaInesperada() {
        try {
            this.loading(false);
            Swal.fire({
                title: 'Ops!',
                text: 'Falha de conexão ou serviço indisponível',
                icon: 'error',
                confirmButtonText: "OK"
            });
        } catch (error) {
            //error
        }
    }

    onError(data) {
        this.loading(false);
        // login successful if there's a jwt token in the response
        if (data && data.error) {
            Swal.fire({
                title: 'Falha',
                text: data.message,
                icon: 'info',
                confirmButtonText: "OK"
            });
        }
    }

    private ecrype (dataObj) {
        var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(dataObj), environment.secretkey);
        return ciphertext.toString();
    }

    private descrype (dataJson: string) {
        var bytes = CryptoJS.AES.decrypt(dataJson, environment.secretkey);
        var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        return decryptedData;
    }
}