import { EventEmitter, Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { collection, doc, getFirestore, onSnapshot, query, setDoc } from 'firebase/firestore';
import { User } from '../../models/user.class';
import { getAuth } from 'firebase/auth';
import { ChatService } from './chat.service';



@Injectable({
  providedIn: 'root'
})

export class ProfilCardService {

  /* ========== FIREBASE ============ */
  firebaseConfig = {
    apiKey: "AIzaSyC520Za3P8qTUGvWM0KxuYqGIMaz-Vd48k",
    authDomain: "da-bubble-87fea.firebaseapp.com",
    projectId: "da-bubble-87fea",
    storageBucket: "da-bubble-87fea.appspot.com",
    messagingSenderId: "970901942782",
    appId: "1:970901942782:web:56b67253649b6206f290af"
  };
  app = initializeApp(this.firebaseConfig);
  db = getFirestore(this.app);
  userRef = collection(this.db, 'users');
  auth = getAuth(this.app);
  allUser = [];
  authSubscription: any;
  userNameandSurname: string = '';
  profilePic: string = '';
  userId: string = '';
  userEmailAddress: string = '';
  headerProfilePic: string = '';
  headerUserNameandSurname: string = '';
  currentUserId: string = '';
  otherUserId: string = '';

  isProfilCardActive: boolean = false;
  isOverlayActive: boolean = false;
  isCurrentUserActive: boolean;
  isProfilCardActiveChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private chatService: ChatService) { }

  toggleCardOverlay(active: boolean) {
    this.isOverlayActive = active;
    this.isProfilCardActiveChanged.emit(active); // Emit event when the variable changes
    if (this.isProfilCardActive) {
      this.isProfilCardActive = false;
    }
  }

  toggleProfilCard(active: boolean, currentUser: boolean, userId: string) {
    if (!this.isOverlayActive) {
      this.isOverlayActive = true;
    }
    this.isProfilCardActive = active;
    this.isCurrentUserActive = currentUser;
    if (currentUser == false) {
      this.otherUserId = userId;
      let userDocRef = doc(this.userRef, userId);
      onSnapshot(userDocRef, (element) => {
        let userData = element.data();
        this.userNameandSurname = userData['name'];
        this.userEmailAddress = userData['email'];
        this.profilePic = userData['imgUrl']
      })
    }
  }

  updateHeader(name: string) {
    return name;
  }

  loadUserFromFirestore() {
    return onSnapshot(this.userRef, (list) => {
      // console.log('Hier sind die User:', list);
      this.allUser = [];
      list.forEach(element => {
        // console.log('Hier sind die User:', element.data(), element.id);
        this.allUser.push(new User(element.data()));
      })
    })
  }

  getTheLoggedInUser() {
    this.authSubscription = this.auth.onAuthStateChanged((user) => {
      if (user) {
        this.profilePic = user.photoURL;
        this.headerProfilePic = user.photoURL;
        this.userNameandSurname = user.displayName;
        this.headerUserNameandSurname = user.displayName;
        this.userEmailAddress = user.email;
        this.currentUserId = user.uid;
      } else {
        this.profilePic = '/assets/img/login/profile_generic_big.png';
        this.userNameandSurname = 'Max Mustermann';
        this.userEmailAddress = 'maxmustermann@gmail.com'
      }
    });
  }

  writeDirectMessage() {
    const q = query(collection(this.db, `users/${this.auth.currentUser.uid}/allDirectMessages`));
    return onSnapshot(q, (list) => {
      list.forEach(element => {
        if(element.id === this.otherUserId) {
          this.chatService.setSelectedUserId(this.otherUserId);
          this.toggleCardOverlay(false);
        } else {
          // Create new DM Chat
          this.addDirectMessage();
          this.toggleCardOverlay(false);
        }  
      });
    });
  }

  async addDirectMessage (): Promise<void> {
    const dmSenderRef = doc(collection(this.db, `users/${this.auth.currentUser}/allDirectMessages`), this.otherUserId);
    const dmReceiverRef = doc(collection(this.db, `users/${this.otherUserId}/allDirectMessages`), this.currentUserId);
    let data = { }
    await setDoc(dmSenderRef, data);
    await setDoc(dmReceiverRef, data);
    this.chatService.setSelectedUserId(this.otherUserId);
  }
}
