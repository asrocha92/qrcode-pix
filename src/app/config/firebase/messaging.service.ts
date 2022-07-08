import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { BehaviorSubject } from 'rxjs';
import { Storage } from './../storage/storage';

import * as $ from 'jquery';

let thisObj;

@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  VAPID_PUBLIC_KEY = 'BIRbR36vsjFh9UPJuOtx9frPokwjowTeBJkMZs2vGuU_8VLhxjH3SsHvr-ZodEW5n4NN_x3p3LgvTuaHcfw4caQ';

  currentMessage = new BehaviorSubject(null);

  public fcm: any;

  constructor(private angularFireMessaging: AngularFireMessaging,
    private storage: Storage) {
    thisObj = this;
    this.angularFireMessaging.messages.subscribe(
      (_messaging) => {
        _messaging['onMessage'] = _messaging['onMessage'].bind(_messaging);
        _messaging['onTokenRefresh'] = _messaging['onTokenRefresh'].bind(_messaging);
      }
    );

  }

  requestPermission() {
    let promise = Notification.requestPermission();
    this.angularFireMessaging.requestToken.subscribe(
      (token) => {
        console.log(token);
        this.fcm = token;
        this.storage.setItem('fcm', token);
      },
      (err) => {
        console.error('Unable to get permission to notify.', err);
      }
    );
  }

  receiveMessage() {
    this.angularFireMessaging.messages.subscribe(
      (payload) => {
        console.log(payload);

        this.notification(payload['notification']['title'], payload['notification']['body']);

        this.currentMessage.next(payload);
      })
  }

  notification(title, msg) {
    this.audioPlay();
    if (title && msg) {
      try {
        if (Notification.permission !== "granted") {
          Notification.requestPermission();
        } else {
          var notification = new Notification('Barbearia Primordial', {
            body: msg,
            icon: 'http://i.stack.imgur.com/Jzjhz.png?s=48&g=1',
            dir: 'auto'
          });

          notification.onclick = function() {
            //manipula evento após a notificação
          };

          setTimeout(() => {
            notification.close();
          }, 5000);
        }
      } catch (e) {
        //console.log(e);
      }
    }
  }

  permisionNotification() {
    try {
      document.addEventListener('DOMContentLoaded', function() {
        if (!Notification) {
          return; //notification não suportada pelo navegador
        }
        if (Notification.permission !== "granted")
          Notification.requestPermission();
      });
    } catch (e) {
      console.log(e);
    }
  }

  audioPlay() {
    try {
      $(document).ready(function() {
        setTimeout(() => {
          var ad = $('#audioted');
          ad.prop("currentTime", 0);
          ad.trigger('play');
          setTimeout(() => {
            thisObj.audioStop();
          }, 5000);
        }, 0);
      });
    } catch (error) {

    }
  }

  audioStop() {
    try {
      $(document).ready(function() {
        try {
          setTimeout(() => {
            var ad = $('#audioted');
            ad.prop("currentTime", 0);
            ad.trigger('pause');
          }, 0);
        } catch (e) {
          console.log(e);
        }
      });
    } catch (error) {

    }
  }

  menssagem () {
  }

}
