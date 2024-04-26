import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { collection, getFirestore, query, onSnapshot, doc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})

export class SearchService {

  firebaseConfig = {
    apiKey: "AIzaSyDOC1-zE5bnxS1ES82HHfl_cg3qm5qyZTQ",
    authDomain: "da-bubble-70ce4.firebaseapp.com",
    projectId: "da-bubble-70ce4",
    storageBucket: "da-bubble-70ce4.appspot.com",
    messagingSenderId: "557141847139",
    appId: "1:557141847139:web:633a63e27efd87edf3dc56"
  };
  app = initializeApp(this.firebaseConfig);
  db = getFirestore(this.app);
  userRef = collection(this.db, 'users');
  channelRef = collection(this.db, 'channels');
  threadsRef = collection(this.db, 'channels');
  auth = getAuth(this.app);

  searchUserResult = [];
  searchChannelsResult = [];
  threads = [];

  constructor() { }

  /**
 * Searches for users based on the provided input.
 * @param {string} input - The input to search for in user names.
 * @returns {Observable} - Returns an observable that emits user search results.
 */
  searchUsers(input: string) {
    this.searchUserResult = [];
    let q = query(this.userRef);
    return onSnapshot(q, (list) => {
      list.forEach(element => {
        let compare = element.data()['name'].toLowerCase();
        let result = element.data();
        if (compare.includes(input.toLowerCase())) {
          this.searchUserResult.push(result);
        }
      })
    })
  }

  /**
 * Searches for users whose names contain a specific substring after an '@' symbol.
 * @param {string} input - The input after the '@' symbol to search for in user names.
 * @returns {Observable} - Returns an observable that emits user search results.
 */
  seachUsersAt(input: string) {
    this.searchUserResult = [];
    let q = query(this.userRef);
    return onSnapshot(q, (list) => {
      list.forEach(element => {
        let compare = element.data()['name'].toLowerCase();
        let result = element.data();
        if (compare.includes(input.slice(1).toLowerCase())) {
          this.searchUserResult.push(result);
        }
      })
    })
  }

  /**
   * Searches for channels based on the provided input.
   * @param {string} input - The input to search for in channel names.
   * @returns {Observable} - Returns an observable that emits channel search results.
   */
  searchChannels(input: string) {
    this.searchChannelsResult = [];
    let q = query(this.channelRef);
    return onSnapshot(q, (list) => {
      list.forEach(element => {
        let compare = element.data()['name'].toLowerCase();
        let result = element.data();
        let docId = element.id;
        let members = element.data()['members'];
        if (members.includes(this.auth.currentUser.uid)) {
          if (compare.includes(input.toLowerCase())) {
            this.searchChannelsResult.push({ id: docId, ...result });
          }
        }
      })
    })
  }

  /**
   * Searches for channels whose names contain a specific substring after an '@' symbol.
   * @param {string} input - The input after the '@' symbol to search for in channel names.
   * @returns {Observable} - Returns an observable that emits channel search results.
   */
  searchChannelsAt(input: string) {
    this.searchChannelsResult = [];
    let q = query(this.channelRef);
    return onSnapshot(q, (list) => {
      list.forEach(element => {
        let compare = element.data()['name'].toLowerCase();
        let result = element.data();
        let docId = element.id;
        let members = element.data()['members'];
        if (members.includes(this.auth.currentUser.uid)) {
          if (compare.includes(input.slice(1).toLowerCase())) {
            this.searchChannelsResult.push({ id: docId, ...result });
          }
        }
      })
    })
  }

  /**
    * Searches for threads based on the provided input.
    * @param {string} input - The input to search for in thread messages.
    * @returns {Observable} - Returns an observable that emits thread search results.
    */
  searchThreads(input: string) {
    this.threads = [];
    let q = query(this.channelRef);
    return onSnapshot(q, (list) => {
      list.forEach((element) => {
        let members = element.data()['members'];
        let docId = element.id;
        let channelName = element.data()['name'];
        if (members.includes(this.auth.currentUser.uid)) {
          this.findThreads(input, docId, channelName)
        }
      });
    });
  }

  /**
  * Finds threads within a specific channel based on the provided input.
  * @param {string} input - The input to search for in thread messages.
  * @param {string} docId - The ID of the channel to search for threads within.
  * @param {string} channelName - The name of the channel.
  */
  findThreads(input: string, docId: string, channelName: string) {
    let channelDocRef = doc(this.channelRef, docId);
    let threadsRef = collection(channelDocRef, 'threads');
    onSnapshot(threadsRef, (threadSnapshot) => {
      threadSnapshot.forEach((threadDoc) => {
        let compare = threadDoc.data()['message'].toLowerCase();
        if (compare.includes(input.toLowerCase())) {
          this.threads.push({ id: docId, channelName: channelName, ...threadDoc.data() });
        }
      });
    });
  }

  /**
 * Checks if there are no search results found.
 * @returns {boolean} - Returns true if no search results are found, otherwise false.
 */
  noResultFound() {
    if (this.searchChannelsResult.length === 0 && this.searchUserResult.length === 0 && this.threads.length === 0) {
      return true;
    } else {
      return false;
    }
  }
}
