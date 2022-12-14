import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app'
import "firebase/auth"
//import firebase from 'firebase/app'


@Injectable({
  providedIn: 'root'
})

export class FirebaseService {

  items: any;
  items2: any;
  hits: any;
  private user: Observable<firebase.User>;
  public userDetails: firebase.User = null;

  constructor(public af: AngularFireDatabase, private firebaseAuth: AngularFireAuth) {
    this.items = af.list('/pitchspeeds').valueChanges();
    this.items2 = af.list('/Starters').valueChanges(); 
    this.hits = af.list('/Hits').valueChanges();
    this.user = firebaseAuth.authState;

      this.user.subscribe(
          (user) => {
            if (user) {
              this.userDetails = user;
              //console.log(this.userDetails);
            }
            else {
              this.userDetails = null;
            }
          }
        );
  }

 signInRegular(email, password) {
   //const credential = firebase.auth.EmailAuthProvider.credential( email, password );
   return this.firebaseAuth.signInWithEmailAndPassword(email, password)
 }

 isLoggedIn() {
  if (this.userDetails == null ) {
      console.log("userDetails are null");
      return false;
    } else {
      //console.log(this.userDetails, "this.userDetails is true and logged in...");
      return true;
    }
  }

  logout() {
    this.firebaseAuth.signOut();
  }

   addData(starters) {
      //console.log(starters, 'starters.json in fb service...');
      console.log('deleting data from fb...');
      this.af.list('/Starters').remove().then(_ => {
        console.log('deleted!');
        this.getStarterData();
      });
      console.log('saving new data to fb...');
      this.af.list('/Starters').push(starters); 
  }

  getStarterData() {
    //console.log('getting starter data from firebase...');
    return this.items2 = this.af.list('/Starters').valueChanges();
  }

  getHits() {
    //console.log('getting Hits data from firebase...');
    return this.hits = this.af.list('/Hits').valueChanges();
  }

  updateCounter(count) {
   //console.log('update counter and exit...');
   let newCount = (count || 0) + 1;
   return this.af.list('/Hits').update('counter', {'hits': newCount});
   
  }

   addData2(fastBallData) {
     this.af.list('/pitchspeeds').push(fastBallData).then(_ => console.log('new pitchspeeds added!')); 
     // this.af.list('/pitchspeeds').remove().then(_ => {
     //    console.log('deleted!');
     //    //this.af.list('/pitchspeeds').push(fastBallData).then(_ => console.log('new pitchspeeds added!')); 
       
     //  });
     
  }

  getData() {
    //console.log('getting starter data from firebase...');
    return this.items = this.af.list('/pitchspeeds').valueChanges();
  }

}