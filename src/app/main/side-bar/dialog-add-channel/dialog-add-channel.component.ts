import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ViewManagementService } from '../../../services/view-management.service';
import { Subscription } from 'rxjs';
import { ChatService } from '../../../services/chat.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog-add-channel',
  standalone: true,
  imports: [MatIconModule, FormsModule, CommonModule],
  templateUrl: './dialog-add-channel.component.html',
  styleUrls: [
    './dialog-add-channel.component.scss',
    './dialog-add-channel.component-mediaquery.scss',
  ],
})
export class DialogAddChannelComponent {
  @Input() isVisible: boolean = false;
  @Output() toggleVisibility = new EventEmitter<void>();
  @Output() onChannelCreation = new EventEmitter<{
    name: string;
    description: string;
  }>();
  @ViewChild('form') form!: NgForm;

  screenSize: string;

  private screenSizeSubscription: Subscription;

  constructor(
    private viewManagementService: ViewManagementService,
    private chatService: ChatService
  ) {}

  inputFocused: boolean = false;
  channelNameModel: string = '';
  channelDescriptionModel: string = '';
  channelNameExists: boolean = false;
  isChannelNameValid: boolean = true;

  ngOnInit(): void {
    this.screenSizeSubscription =
      this.viewManagementService.screenSize$.subscribe((size) => {
        this.screenSize = size;
      });
  }

  ngOnDestroy(): void {
    this.screenSizeSubscription.unsubscribe();
  }

  toggle(): void {
    this.toggleVisibility.emit();
  }
  stopPropagation(event: MouseEvent) {
    event.stopPropagation();
  }

  onInputFocus(): void {
    this.inputFocused = true;
  }

  onInputBlur(): void {
    this.inputFocused = false;
  }

  // createChannel(): void {
  //   if (this.form?.valid) {
  //     this.chatService
  //       .channelNameExists(this.channelNameModel)
  //       .then((exists) => {
  //         this.channelNameExists = exists; // Setze den Wert basierend auf der Existenz des Kanalnamens
  //         if (exists) {
  //           // Hinweis anzeigen, dass der Kanalname bereits existiert
  //         } else {
  //           // Kanal erstellen, da der Name nicht existiert
  //           this.onChannelCreation.emit({
  //             name: this.channelNameModel,
  //             description: this.channelDescriptionModel,
  //           });
  //           if (this.screenSize !== 'extraSmall') {
  //             this.toggle(); // Schließt das Dialogfenster bei Mobile nicht
  //           }
  //           console.log('Kanal erstellt');
  //         }
  //       });
  //   } else {
  //     console.log('Formular ist nicht gültig.');
  //   }
  // }

  onChannelNameChange(): void {
    if (this.channelNameModel.trim()) {
      // Prüft, ob der Kanalname bereits existiert
      this.chatService
        .channelNameExists(this.channelNameModel)
        .then((exists) => {
          this.channelNameExists = exists;
          this.isChannelNameValid = !exists;
        });
    } else {
      this.channelNameExists = false;
      this.isChannelNameValid = false; // Deaktiviere den Button, wenn das Feld leer ist
    }
  }

  createChannel(): void {
    if (this.form?.valid && !this.channelNameExists) {
      // Kanal erstellen, da der Name nicht existiert und das Formular gültig ist
      this.onChannelCreation.emit({
        name: this.channelNameModel,
        description: this.channelDescriptionModel,
      });
      if (this.screenSize !== 'extraSmall') {
        this.toggle(); // Schließt das Dialogfenster bei Mobile nicht
      }
    }
  }
}
