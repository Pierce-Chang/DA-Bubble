import { Component, OnInit } from '@angular/core';
import { ProfilCardService } from '../../services/profil-card.service';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { initializeApp } from 'firebase/app';
import { getAuth, updateEmail, updateProfile } from "firebase/auth";
import { FormsModule } from '@angular/forms';
import { collection, doc, getFirestore, onSnapshot, query, setDoc } from 'firebase/firestore';
import { ChatService } from '../../services/chat.service';

const firebaseConfig = {
  apiKey: "AIzaSyDOC1-zE5bnxS1ES82HHfl_cg3qm5qyZTQ",
  authDomain: "da-bubble-70ce4.firebaseapp.com",
  projectId: "da-bubble-70ce4",
  storageBucket: "da-bubble-70ce4.appspot.com",
  messagingSenderId: "557141847139",
  appId: "1:557141847139:web:633a63e27efd87edf3dc56"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

@Component({
  selector: 'app-profil-card',
  standalone: true,
  imports: [CommonModule, MatIcon, FormsModule],
  templateUrl: './profil-card.component.html',
  styleUrl: './profil-card.component.scss'
})

export class ProfilCardComponent implements OnInit {
  authSubscription: any;
  auth = getAuth(app);
  edit: boolean = false;
  userNameandSurname: string = '';
  profilePic: string = '';
  userId: string = '';
  userEmailAddress: string = '';
  newEmail: string;
  newName: string;

  constructor(public serviceProfilCard: ProfilCardService, private chatService: ChatService) {
  }

  ngOnInit(): void {
    this.serviceProfilCard.getTheLoggedInUser();
  }

  toggleEdit(active: boolean) {
    this.serviceProfilCard.checkIfGuestOnline();
    this.edit = active;
  }

  getTheLoggedInUser() {
    this.authSubscription = this.auth.onAuthStateChanged((user) => {
      if (user) {
        this.profilePic = user.photoURL;
        this.userNameandSurname = user.displayName;
        this.userEmailAddress = user.email;
      } else {
        this.profilePic = '/assets/img/login/profile_generic_big.png';
        this.userNameandSurname = 'Max Mustermann';
        this.userEmailAddress = 'maxmustermann@gmail.com'
      }
    });
  }

  async updateUserData() {
    if (this.newName != '') {
      await updateProfile(this.auth.currentUser, {
        displayName: this.newName,
      })
      this.newName = '';
    }
    if (this.newEmail != '') {
      await updateEmail(this.auth.currentUser, this.newEmail)
    }
    this.newEmail = '';
    this.createUserDetailsDoc();
    this.toggleEdit(false);
    this.serviceProfilCard.getTheLoggedInUser();
  }

  async createUserDetailsDoc() {
    await setDoc(doc(db, "users", this.auth.currentUser.uid), {
      name: this.auth.currentUser.displayName,
      email: this.auth.currentUser.email,
      imgUrl: this.auth.currentUser.photoURL,
      isOnline: false,
      id: this.auth.currentUser.uid,
    });
  }
}
