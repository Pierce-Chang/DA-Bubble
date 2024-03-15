import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { ThreadMessage } from '../../models/threadMessage.class';
import { Thread } from '../../models/thread.class';

const firebaseConfig = {
  apiKey: 'AIzaSyC520Za3P8qTUGvWM0KxuYqGIMaz-Vd48k',
  authDomain: 'da-bubble-87fea.firebaseapp.com',
  projectId: 'da-bubble-87fea',
  storageBucket: 'da-bubble-87fea.appspot.com',
  messagingSenderId: '970901942782',
  appId: '1:970901942782:web:56b67253649b6206f290af',
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private activeChannelId: string;
  private selectedUserId: string;

  private threadOpenSource = new BehaviorSubject<boolean>(false);
  threadOpen$ = this.threadOpenSource.asObservable();
  private threadsSource = new BehaviorSubject<Thread[]>([]);
  threads$ = this.threadsSource.asObservable();
  private selectedThreadIdSource = new BehaviorSubject<string | null>(null);
  selectedThreadId$ = this.selectedThreadIdSource.asObservable();

  private activeChannelIdUpdated = new BehaviorSubject<string | null>(null);
  get activeChannelIdUpdates() {
    return this.activeChannelIdUpdated.asObservable();
  }

  private activeUserIdUpdated = new BehaviorSubject<string | null>(null);
  get activeUserIdUpdates() {
    return this.activeUserIdUpdated.asObservable();
  }

  constructor() {}

  // ------------------- Channel Logic --------------------

  setActiveChannelId(channelId: string) {
    this.activeChannelId = channelId;
    this.selectedUserId = null;
    this.activeChannelIdUpdated.next(channelId);
    this.loadThreads(channelId);
    // console.log(`Aktiver Channel: ${this.activeChannelId}`);
  }

  getActiveChannelId(): string {
    return this.activeChannelId;
  }

  setSelectedUserId(userId: string) {
    this.selectedUserId = userId;
    this.activeChannelId = null;
    this.activeUserIdUpdated.next(userId);
    // console.log(`Ausgewählter User: ${this.selectedUserId}`);
  }

  getSelectedUserId(): string {
    return this.selectedUserId;
  }

  // ------------------- MainChat Logic --------------------

  async getThreads(channelId): Promise<Thread[]> {
    const threadsRef = collection(db, `channels/${channelId}/threads`);
    const snapshot = await getDocs(threadsRef);
    const threads: Thread[] = snapshot.docs.map(
      (doc) => new Thread({ ...doc.data(), threadId: doc.id })
    );

    // console.log('Geladene Threads:', threads);
    return threads;
  }

  async loadThreads(channelId: string): Promise<void> {
    const threads = await this.getThreads(channelId);
    this.threadsSource.next(threads);
  }

  // ------------------- SecondaryChat Logic --------------------

  openThread(threadId: string) {
    this.threadOpenSource.next(false);
    this.selectedThreadIdSource.next(threadId);
    setTimeout(() => {
      this.threadOpenSource.next(true);
    }, 30);
  }

  closeThread(): void {
    this.selectedThreadIdSource.next(null);
    this.threadOpenSource.next(false);
  }

  // ------------------- Channel creation Logic --------------------

  async channelNameExists(channelName: string): Promise<boolean> {
    const channelsRef = collection(db, 'channels');
    const snapshot = await getDocs(channelsRef);
    const channelExists = snapshot.docs.some(
      (doc) => doc.data()['name'] === channelName
    );
    return channelExists;
  }
}
