import { computed, autorun, makeAutoObservable, observable, flow, action } from 'mobx';

import anylogger from 'anylogger';
const log = anylogger('user-store');

// import { Tenant } from '../models/tenant';
import { User } from '../models/user';
import { RootStore } from './root-store';

export class UserStore {
  rootStore: RootStore;
  currentUser: User;
  redirectUrl: string;

  constructor(rootStore) {
    // TODO do we need all these attributes to be observable?
    makeAutoObservable(this, {
      currentUser: observable,
      setCurrentUser: action,
      getCurrentUser: flow,
      describeUser: computed,
    });
    autorun(() => {
      // Some action we might need to run just once
    });
    this.rootStore = rootStore;
  }

  setCurrentUser(user) {
    // const newUser = new User({ anonymous: user.anon, locale: user.locale, tenant: new Tenant(this, user.tenant) });
    this.currentUser = user;
  }

  setUserRedirectUrl(url) {
    this.redirectUrl = url;
  }

  getUserRedirectUrl() {
    return this.redirectUrl;
  }

  /**
   * Using flow instead of async / await
   * Check more info here:
   * https://mobx.js.org/actions.html#using-flow-instead-of-async--await-
   */
  *getCurrentUser() {
    try {
      const response = yield fetch('/api/me');
      const data = yield response.json();
      const user = new User(data);
      return user;
    } catch (error: unknown) {
      log.error(`Unable to get current user from the API`, error);
    }
  }

  get describeUser() {
    return `Current user is ${this.currentUser.anonymous ? 'a ghost' : this.currentUser.displayName} and belongs to tenant ${this.currentUser.tenant.displayName}`;
  }
}
