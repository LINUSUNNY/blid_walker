import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http';
import { AlertController } from 'ionic-angular';
import { TextToSpeech } from '@ionic-native/text-to-speech';


/*
  Generated class for the ServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ServiceProvider {

  constructor(public http: HttpClient, public httpI: HTTP, private alertCtrl: AlertController, private tts: TextToSpeech) {
    console.log('Hello ServiceProvider Provider');
  }

  public getDescription(imgData){

    this.speak("Hey basil, Im analysing the scene, give me second")

    this.httpI.post('http://35.237.226.165:5000/get_description', {img:imgData}, {})
  .then(data => {

    console.log(data.status);
    console.log(data.data); // data received by server
    console.log(data.headers);
   this.speak(data.data)

  })
  .catch(error => {

    console.log(error.status);
    console.log(error.error); // error message as string
    console.log(error.headers);
    this.presentAlert(error.error)

  });
  }

  presentAlert(description) {
    let alert = this.alertCtrl.create({
      title: 'Low battery',
      subTitle: description,
      buttons: ['Dismiss']
    });
    alert.present();
  }
speak(text){
  this.tts.speak(text)
  .then(() => console.log('Success'))
  .catch((reason: any) => console.log(reason));
}


}
