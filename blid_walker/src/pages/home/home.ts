import { Component } from '@angular/core';
import { NavController,Platform } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ServiceProvider } from '../../providers/service/service';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder';
import { BatteryStatus } from '@ionic-native/battery-status';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { isLeapYear } from 'ionic-angular/umd/util/datetime-util';
declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  stat:any;
  lat:any
  lng:any;
  currentdate:any;
  map:any;
  currenttime:any;
  
  
  public imageData: String;
  
  matches: String[];
  isRecording = false;
  
  constructor(public navCtrl: NavController, private camera: Camera, private service:ServiceProvider,private  speechRecognition: SpeechRecognition,private plt: Platform, private cd: ChangeDetectorRef,public geo:Geolocation,private nativeGeocoder: NativeGeocoder,private batterystatus: BatteryStatus,private tts: TextToSpeech) {
var month=['janaury','february','march','april','may','june','august','september','october','november','december']
var months=new Date().getMonth();
var year=new Date().getFullYear().toString();
var dates=new Date().getDate().toString();
var Hours=new Date().getHours().toString();
var minut=new Date().getMinutes().toString();
this.currentdate=dates+month[months-1]+year;
this.currenttime=Hours+minut;

 
//this.getStatus();
this.batterystatus.onChange().subscribe(status=>
  {
this.stat = status;


});
  }
  
  options: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
};


reverseGeocode()
{
 
this.nativeGeocoder.reverseGeocode(this.lat,this.lng,this.options)
  .then((result: NativeGeocoderReverseResult[]) => this.tts.speak(JSON.stringify(result[0].locality+result[0].thoroughfare)))
  .catch((error: any) => alert(error));
}

  ionViewDidLoad()
  {
 
    this.geo.getCurrentPosition().then( pos => {
      this.lat = pos.coords.latitude;
    this.lng = pos.coords.longitude;
    }).catch( err => console.log(err));
    
  }


  takePicture(){

     const options: CameraOptions = {
      quality: 20,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetHeight:500,
      targetWidth:500
    }
    
    this.camera.getPicture(options).then((imageDatab4) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64 (DATA_URL):
     let base64Image = 'data:image/jpeg;base64,' + imageDatab4;
     this.imageData = base64Image;
     console.log(imageDatab4);
     this.service.getDescription(imageDatab4);     

    }, (err) => {
     // Handle error
    });
  }
  isIos() {
    return this.plt.is('ios');
  }
 
  stopListening() {
    this.speechRecognition.stopListening().then(() => {
      this.isRecording = false;
    });
  }
 
 ngOnInit() {
    this.speechRecognition.hasPermission()
      .then((hasPermission: boolean) => {
        if (!hasPermission) {
          this.speechRecognition.requestPermission()
          .then(
            () => console.log('Granted'),
            () => console.log('Denied')
          )
        }
      });
  }
 
  startListening() {
    let options = {
      language: 'en-US'
    }
    this.speechRecognition.startListening().subscribe(matches => {
      this.matches = matches;
      this.cd.detectChanges();
    });
    this.isRecording = true;
  }
  /*initializeMap() {
 
    let locationOptions = {timeout: 20000, enableHighAccuracy: true};

    navigator.geolocation.getCurrentPosition(

        (position) => {

            let options = {
              center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
              zoom: 16,
              mapTypeId: google.maps.MapTypeId.ROADMAP
            }









            this.map = new google.maps.Map(document.getElementById("map_canvas"), options);
        },

        (error) => {
            console.log(error);
        }, locationOptions
    );
}  */ 
dates()
{
  this.tts.speak(JSON.stringify('date is'+this.currentdate+'time is'+this.currenttime))
  .then(() =>alert('Success'))
  .catch((reason: any) => alert(reason));
}
 getStatus()
 {
  this.tts.speak('battery is'+JSON.stringify(this.stat.level)+'percentage')
  .then(() => alert('Success'))
  .catch((reason: any) => alert(reason));
 }
}
