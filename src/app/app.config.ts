import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment.development';

const firebaseConfig = {
  apiKey: "AIzaSyDOC1-zE5bnxS1ES82HHfl_cg3qm5qyZTQ",
  authDomain: "da-bubble-70ce4.firebaseapp.com",
  projectId: "da-bubble-70ce4",
  storageBucket: "da-bubble-70ce4.appspot.com",
  messagingSenderId: "557141847139",
  appId: "1:557141847139:web:633a63e27efd87edf3dc56"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    importProvidersFrom([
      provideFirebaseApp(() => initializeApp(firebaseConfig)),
      provideStorage(() => getStorage()),
      provideFirestore(() => getFirestore()),
    ]),
  ],
};
