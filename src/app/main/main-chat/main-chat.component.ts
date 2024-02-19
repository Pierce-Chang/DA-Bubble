import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ChannelEditionDialogComponent } from './channel-edition-dialog/channel-edition-dialog.component';
import { ShowMembersDialogComponent } from './show-members-dialog/show-members-dialog.component';
import { AddMembersDialogComponent } from './add-members-dialog/add-members-dialog.component';

export interface Fruit {
  name: string;
}

@Component({
  selector: 'app-main-chat',
  standalone: true,
  imports: [ CommonModule, FormsModule, MatIconModule, ReactiveFormsModule, MatFormFieldModule,
  ChannelEditionDialogComponent, ShowMembersDialogComponent, AddMembersDialogComponent ],
  templateUrl: './main-chat.component.html',
  styleUrl: './main-chat.component.scss'
})
export class MainChatComponent {
    textArea: string = "";
    showChannel: boolean = true;
    addMemberDialogOpen: boolean = false;
    channelEditionDialogOpen: boolean = false;
    showMembersDialogOpen: boolean = false;
    ownMessage: boolean = true;
    editMessagePopupOpen = false

    newMember: string = "";
    newMemberObject = {
      'userId': 'ikeikeoie',
      'name': this.newMember,
      'surname': 'M.',
      'photo': '../../../assets/img/main-chat/member2.svg'
    };

    @Input() channels = [{
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
        'threads': [{'message': 'Was für eine Frage hast du genau?'}],
        'reactions': [{'reactedBy': 'sadmvkui25ddf', 'ractionName': 'rocket', 'iconPath': '../../../assets/img/main-chat/arrowDownDefault.svg'}]
      }]
    }];

    users = [{
      'userId': 'sadmvkui25ddf',
      'name': 'Filip',
      'surname': 'Todoroski',
      'photo': '../../../assets/img/main-chat/member1.svg',
      'onlineStatus': 'online'
      },
      {        'userId': 'sadf123sadf',
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
    membercount = this.channels[0]['members'].length;

    constructor() { }

    toggleDialog(dialog: string) {
      if(dialog == 'addMember'){
        if(this.addMemberDialogOpen == false) {
          this.addMemberDialogOpen = true;
        } else {
          this.addMemberDialogOpen = false;
        }
      } else if(dialog == 'channelEdition') {
        if(this.channelEditionDialogOpen == false) {
          this.channelEditionDialogOpen = true;
        } else {
          this.channelEditionDialogOpen = false;
        }
      } else if(dialog == 'showMembers') {
        if(this.showMembersDialogOpen == false) {
          this.showMembersDialogOpen = true;
        } else {
          this.showMembersDialogOpen = false;
        }
      }
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

    openThread() {

    }

    moreOptions() {
      this.editMessagePopupOpen = true;
    }
}
