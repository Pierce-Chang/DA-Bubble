import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';

export type ScreenSize = 'extraSmall' | 'small' | 'medium' | 'large';

@Injectable({
  providedIn: 'root',
})
export class ViewManagementService {
  public screenSize = new BehaviorSubject<ScreenSize>('large');
  screenSize$ = this.screenSize.asObservable();

/*   public showChannel = new BehaviorSubject<boolean>(false);
  showChannel$ = this.showChannel.asObservable();

  public showDirectMessage = new BehaviorSubject<boolean>(false);
  showDirectMessage$ = this.showDirectMessage.asObservable(); */

  public showNewMessage = new BehaviorSubject<boolean>(false);
  showNewMessage$ = this.showNewMessage.asObservable();

  public showSidebar = new BehaviorSubject<boolean>(true);
  showSidebar$ = this.showSidebar.asObservable();

  public showSecondaryChat = new BehaviorSubject<boolean>(false);
  showSecondaryChat$ = this.showSecondaryChat.asObservable();

  public showSidebarToggle = new BehaviorSubject<boolean>(true);
  showSidebarToggle$ = this.showSidebarToggle.asObservable();

  public showMainChat = new BehaviorSubject<boolean>(true);
  showMainChat$ = this.showMainChat.asObservable();

  //public showMainChat$: Observable<boolean>;
  public defaultLogoVisible$: Observable<boolean>;
  private previousWidth = window.innerWidth; 
  actualView : string = '';

  constructor() {
    this.updateScreenSize(window.innerWidth);
    this.handleWindowResize();

    this.defaultLogoVisible$ = combineLatest([
      this.screenSize$,
      this.showSidebar$,
    ]).pipe(
      map(([screenSize, showSidebar]) => {
        return !(screenSize === 'small' || screenSize === 'extraSmall') || showSidebar;
      })
    );

    /* this.showMainChat$ = combineLatest([
      this.showChannel.asObservable(),
      this.showDirectMessage.asObservable(),
    ]).pipe(
      map(
        ([showChannel, showDirectMessage]) => showChannel || showDirectMessage
      )
    ); */
  }

  /**
   * Updates the internal screen size state based on the provided window width.
   *
   * @param {number} width - The current width of the window, used to determine the screen size category.
   */
  updateScreenSize(width: number): void {
    if (width <= 500) {
      this.screenSize.next('extraSmall');
    } else if (width > 500 && width <= 1110) {
      this.screenSize.next('small');
    } else if (width > 1110 && width <= 1500) {
      this.screenSize.next('medium');
    } else {
      this.screenSize.next('large');
    }
  }

  /**
   * Sets up an event listener on the window object to handle resize events.
   * Calls `updateScreenSize` with the new window width whenever the window is resized,
   * allowing for dynamic adjustment of the UI based on screen size.
   */
  handleWindowResize(): void {
    window.addEventListener('resize', () => {
      const currentWidth = window.innerWidth;
      const wasLargerThan1500 = this.previousWidth > 1500;
      const wasLessThanOrEqual1110 = this.previousWidth <= 1110;
      const isNowGreaterThan1110 = currentWidth > 1110;
      const wasSecondaryChatOpen = this.showSecondaryChat.value;
  
      this.updateScreenSize(currentWidth);
  
      if (wasLargerThan1500 && currentWidth <= 1500) {
        if (wasSecondaryChatOpen) {
          this.showMainChat.next(true);
          this.showSecondaryChat.next(true);
          this.showSidebar.next(false);
        } else {
          this.showMainChat.next(true);
          this.showSidebar.next(true);
        }

/*         this.showSecondaryChat$.subscribe((showSecondaryChat) => {
          if (showSecondaryChat) {
            this.setView('secondaryChat');
          }
        }).unsubscribe();  */
      }

      if (this.previousWidth <= 1500 && currentWidth > 1500) {
        this.showMainChat.next(true);
        this.showSidebar.next(true);
        if (wasSecondaryChatOpen) {
          this.showSecondaryChat.next(true);
        // console.log('@@@@')
        } else {
          this.showSecondaryChat.next(false);
        }
      }
  
      if (wasLessThanOrEqual1110 && isNowGreaterThan1110) {
        if (wasSecondaryChatOpen) {
          this.showMainChat.next(true);
          this.showSecondaryChat.next(true);
          this.showSidebar.next(false);
        } else {
          this.setView('sidebar');
          this.showMainChat.next(true);
        }
      }

      if (this.previousWidth >= 1110 && !isNowGreaterThan1110) {
        if (wasSecondaryChatOpen) {
          this.showMainChat.next(true);
          this.showSecondaryChat.next(false);
          this.showSidebar.next(false);
        } else {
          this.showMainChat.next(true);
          this.showSidebar.next(false);
        }
     }
   
      this.previousWidth = currentWidth;
    });
  }
  
  

  private viewSettings = {
    extraSmall: {
      sidebar: {
        showSidebar: true,
        showMainChat: false,
        //showDirectMessage: false,
        showNewMessage: false,
        showSecondaryChat: false,
      },
      channel: {
        showSidebar: false,
        showMainChat: true,
        //showDirectMessage: false,
        showNewMessage: false,
        showSecondaryChat: false,
      },
/*       directMessage: {
        showSidebar: false,
        showMainChat: false,
        showDirectMessage: true,
        showNewMessage: false,
        showSecondaryChat: false,
      }, */


      newMessage: {
        showNewMessage: true,
        showSidebar: false,
        showMainChat: false,
        //showDirectMessage: false,
        showSecondaryChat: false,
      },
      secondaryChat: {
        showSidebar: false,
        showMainChat: false,
        //showDirectMessage: false,
        showNewMessage: false,
        showSecondaryChat: true,
      },
    },
    small: {
      sidebar: {
        showSidebar: true,
        showMainChat: false,
        //showDirectMessage: false,
        showNewMessage: false,
        showSecondaryChat: false,
      },
      channel: {
        showSidebar: false,
        showMainChat: true,
        //showDirectMessage: false,
        showNewMessage: false,
        showSecondaryChat: false,
      },
/*       directMessage: {
        showSidebar: false,
        showChannel: false,
        showDirectMessage: true,
        showNewMessage: false,
        showSecondaryChat: false,
      }, */


      newMessage: {
        showNewMessage: true,
        showSidebar: false,
        showMainChat: false,
        //showDirectMessage: false,
        showSecondaryChat: false,
      },
      secondaryChat: {
        showSidebar: false,
        showMainChat: false,
        //showDirectMessage: false,
        showNewMessage: false,
        showSecondaryChat: true,
      },
    },
    medium: {
      sidebar: {
        showSidebar: true,
        showSidebarToggle: true,
        showSecondaryChat: false,
      },
      channel: {
        showSidebar: true,
        showSidebarToggle: true,
        showMainChat: true,
        //showDirectMessage: false,
        showNewMessage: false,
        showSecondaryChat: false,
      },
/*       directMessage: {
        showSidebar: true,
        showSidebarToggle: true,
        showChannel: false,
        showDirectMessage: true,
        showNewMessage: false,
        showSecondaryChat: false,
      }, */


      newMessage: {
        showSidebar: true,
        showNewMessage: true,
        showSidebarToggle: true,
        showMainChat: false,
        //showDirectMessage: false,
        showSecondaryChat: false,
      },
      secondaryChat: {
        showSidebar: false,
        showSidebarToggle: false,
        showMainChat: true,
        showSecondaryChat: true,
      },
    },
    large: {
      sidebar: {
        showMainChat: true,
        showSecondaryChat: false,
      },
      channel: {
        showMainChat: true,
        //showDirectMessage: false,
        showNewMessage: false,
        showSecondaryChat: false,
      },
/*       directMessage: {
        showSidebar: true,
        showChannel: false,
        showDirectMessage: true,
        showNewMessage: false,
        showSecondaryChat: false,
      }, */

      newMessage: {
        showSidebar: true,
        showNewMessage: true,
        showMainChat: false,
        //showDirectMessage: false,
        showSecondaryChat: false,
      },
      secondaryChat: {
        showSecondaryChat: true,
      },
    },
  };

  /**
   * Updates the visibility states of various UI components based on the provided properties object.
   *
   * @param {object} properties - An object containing key-value pairs where each key corresponds to a BehaviorSubject managing the visibility of a UI component, and each value is the new state (true or false) to be applied.
   */
  private updateViewProperties(properties: object): void {
    for (const key of Object.keys(properties)) {
      this[key].next(properties[key]);
    }
  }

  /**
   * Sets the current view configuration based on the specified view type.
   * updates various BehaviorSubjects related to UI component visibility to match predefined settings for the current screen size.
   * uses current `screenSize` value to determine which set of view settings to apply, allowing for responsive adjustments to the UI.
   *
   * @param {'sidebar' | 'channel' | 'newMessage' | 'secondaryChat'} view - The view type to set, determining which components are visible.
   */
  setView(
    view:
      | 'sidebar'
      | 'channel'
   //   | 'directMessage'
      | 'newMessage'
      | 'secondaryChat'
  ): void {
    let screenSize = this.screenSize.value;
    this.actualView = view;
    const settingsForSize = this.viewSettings[screenSize];
    if (!settingsForSize || !settingsForSize[view]) {
      return;
    }

    this.updateViewProperties(settingsForSize[view]);
  }
}
