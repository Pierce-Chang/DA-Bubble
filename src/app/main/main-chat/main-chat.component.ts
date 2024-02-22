import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ChannelEditionDialogComponent } from './channel-edition-dialog/channel-edition-dialog.component';
import { ShowMembersDialogComponent } from './show-members-dialog/show-members-dialog.component';
import { AddMembersDialogComponent } from './add-members-dialog/add-members-dialog.component';
import { SecondaryChatComponent } from './secondary-chat/secondary-chat.component';
import { ChatService } from '../../services/chat.service';
import { Subscription } from 'rxjs';

import { initializeApp } from "firebase/app";
import { getFirestore, collection, onSnapshot,  limit, query, doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth } from 'firebase/auth';
import { Router } from '@angular/router';
import { Channel } from '../../../models/channel.class';

const firebaseConfig = {
  apiKey: "AIzaSyC520Za3P8qTUGvWM0KxuYqGIMaz-Vd48k",
  authDomain: "da-bubble-87fea.firebaseapp.com",
  projectId: "da-bubble-87fea",
  storageBucket: "da-bubble-87fea.appspot.com",
  messagingSenderId: "970901942782",
  appId: "1:970901942782:web:56b67253649b6206f290af"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export interface Fruit {
  name: string;
}

@Component({
  selector: 'app-main-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, ReactiveFormsModule, MatFormFieldModule,
    ChannelEditionDialogComponent, ShowMembersDialogComponent, AddMembersDialogComponent, SecondaryChatComponent],
  templateUrl: './main-chat.component.html',
  styleUrl: './main-chat.component.scss'
})
export class MainChatComponent implements OnInit, OnDestroy {
  activeChannel: string;
  channel = [];

  @Input() textAreaEditMessage: string = "Welche Version ist aktuell von Angular?";
  subscription: Subscription = new Subscription();
  threadOpen: boolean = false;
  textArea: string = "";
  showChannel: boolean = true;
  addMemberDialogOpen: boolean = false;
  channelEditionDialogOpen: boolean = false;
  showMembersDialogOpen: boolean = false;
  ownMessage: boolean = true;
  editMessagePopupOpen: boolean = false;
  ownMessageEdit: boolean = false;

  newMember: string = "";
  newMemberObject = {
    'userId': 'ikeikeoie',
    'name': this.newMember,
    'surname': 'M.',
    'photo': '../../../assets/img/main-chat/member2.svg'
  };

 /*  @Input() channels = [{
    'id': 'sijfef8e8',
    'name': 'Entwicklerteam',
    'members': [{
      'userId': 'sadf123sadf',
      'name': 'Tobias',
      'surname': 'Odermatt',
      'photo': '../../../assets/img/main-chat/member1.svg'
    },
    {
      'userId': 'iej896sdf',
      'name': 'Pierce',
      'surname': 'C.',
      'photo': '../../../assets/img/main-chat/member2.svg'
    },
    {
      'userId': 'sadmvkui25ddf',
      'name': 'Filip',
      'surname': 'Todoroski',
      'photo': '../../../assets/img/main-chat/member3.svg'
    }
    ],
    'messages': [{
      'from': 'sadf123sadf',
      'createDate': '10.02.2024',
      'message': 'Hallo Zusammen, ich habe ein Frage zu Angular',
      'threads': [{ 'message': 'Was für eine Frage hast du genau?' }],
      'reactions': [{ 'reactedBy': 'sadmvkui25ddf', 'ractionName': 'rocket', 'iconPath': '../../../assets/img/main-chat/arrowDownDefault.svg' }]
    }]
  }]; */

  users = [{
    'userId': 'sadmvkui25ddf',
    'name': 'Filip',
    'surname': 'Todoroski',
    'photo': '../../../assets/img/main-chat/member1.svg',
    'onlineStatus': 'online'
  },
  {
    'userId': 'sadf123sadf',
    'name': 'Tobias',
    'surname': 'Odermatt',
    'photo': '../../../assets/img/main-chat/member2.svg',
    'onlineStatus': 'idle'
  },
  {
    'userId': 'iej896sdf',
    'name': 'Pierce',
    'surname': 'C.',
    'photo': '../../../assets/img/main-chat/member3.svg',
    'onlineStatus': 'busy'
  },
  {
    'userId': 'okokloilk366',
    'name': 'Pascal',
    'surname': 'M.',
    'photo': '../../../assets/img/main-chat/member1.svg',
    'onlineStatus': 'away'
  },
  {
    'userId': 'sadfsadf8585',
    'name': 'Florian',
    'surname': 'Scholz',
    'photo': '../../../assets/img/main-chat/member2.svg',
    'onlineStatus': 'online'
  },
  ];

  //membercount = this.channel[0]['members'].length;

  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
    this.subscription.add(this.chatService.threadOpen$.subscribe(open => {
      this.threadOpen = open;
    }));
    this.getCurrentChannel();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /* ================== Main chat get channel data ================== */
  getCurrentChannel() {
    const q = query(collection(db, 'channels'));
    return onSnapshot(q, (list) => {
      this.channel = [];
      list.forEach(element => {
        if(element.data()["isActive"] == true) {
          this.channel.push(element.data());
          console.log('Current channel data', this.channel);
        }
      });
    });
  }

/*   async getUser() {
    if(this.userId) {
    //let currentUser = doc(collection(this.firestore, 'users'), this.userId);
    //let currentUserSnap = await getDoc(currentUser);

    onSnapshot(doc(collection(this.firestore, 'users'), this.userId), (doc) => {
      this.user = new User(doc.data());
    });
          //this.user = new User(currentUserSnap);  // das JSON "currentUserSnap.data()" welches wir von der DB erhalten wird in ein Objekt vom Typ User umgewandelt.
        console.log('Retrieved user', this.user);
    }
  } */


/*   getCurrentChanelData() {
      // orderBy('title')
      const q = query(this.getUsersRef(), limit(50));
      return onSnapshot(q, (list) => {
        this.allUsers = [];
        list.forEach(element => {
            let documentRef: string = element.id;
            this.allUsers.push(this.setUserObject(element.data(), documentRef));
            this.addDocIdToUser(documentRef);
        });
  
        // Mit der docChanges kann man sich die änderungen eines Dokuments auslogen lassen.
        list.docChanges().forEach((change) => {
          if(change.type === "added") {
            //console.log("New note: ", change.doc.data());
          }
          if(change.type === "modified") {
            //console.log("Modified note: ", change.doc.data());
          }if(change.type === "removed") {
            //console.log("Removed note: ", change.doc.data());
          }
        })
      });
  } */

/*   getUsersRef(){
    return collection(this.firestore, 'users'); // Zugriff auf die Datenbank
                                                // => collection() Method greift auf die gesamte Datenbank (Collection) zu
  } */

/*   async addDocIdToUser(documentRef: string) {
    let currentUserRef = doc(this.firestore, 'users', documentRef);
    let data = {id: documentRef};
    updateDoc(currentUserRef, data);
  } */

/*   setUserObject(obj: any, id: string): User {
    return {
      id: id || "",
      firstName: obj.firstName || "",
      lastName: obj.lastName || "",
      email: obj.email || "",
      birthDate: obj.birthDate || "" ,
      address: obj.address || "",
      zipCode: obj.zipCode || "",
      city: obj.city || "",
    }
  } */

  /* ======================================================== */


  toggleDialog(dialog: string) {
    if (dialog == 'addMember') {
      if (this.addMemberDialogOpen == false) {
        this.addMemberDialogOpen = true;
      } else {
        this.addMemberDialogOpen = false;
      }
    } else if (dialog == 'channelEdition') {
      if (this.channelEditionDialogOpen == false) {
        this.channelEditionDialogOpen = true;
      } else {
        this.channelEditionDialogOpen = false;
      }
    } else if (dialog == 'showMembers') {
      if (this.showMembersDialogOpen == false) {
        this.showMembersDialogOpen = true;
      } else {
        this.showMembersDialogOpen = false;
      }
    }
    console.log('Active channel', this.activeChannel);

    console.log('Current channel data', this.channel);

  }

  closeDialog() {
    this.addMemberDialogOpen = false;
    this.channelEditionDialogOpen = false;
    this.showMembersDialogOpen = false;
  }

  doNotClose($event: any) {
    $event.stopPropagation();
  }

  setBoolean(dialogBoolen: boolean) {
    this.channelEditionDialogOpen = false;
    this.showMembersDialogOpen = false;
    this.addMemberDialogOpen = false;
  }

  switchToAddMembers(addMemberDialogOpen: boolean) {
    this.addMemberDialogOpen = true;
  }

  addReaction(emoji: string) {

  }

  openMoreEmojis() {

  }

  moreOptions() {
    this.editMessagePopupOpen = true;
  }

  editMessage() {
    this.editMessagePopupOpen = false;
    this.ownMessageEdit = true;
  }

  closeEditedMessage() {
    this.ownMessageEdit = false;
  }

  saveEditedMessage() {
    // 
  }

  openThread(): void {
    this.chatService.openThread();
  }
}
