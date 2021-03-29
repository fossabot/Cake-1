import { makeAutoObservable, computed, observable } from 'mobx';
import { Tenant } from './tenant';

export class User {
  store: null;
  anonymous: boolean;
  tenant: Tenant;
  locale: string;
  acceptedTC: boolean;
  authenticationStrategy: string;
  displayName: string;
  email: string;
  emailPreferences: string;
  id: number;
  isGlobalAdmin: boolean;
  isTenantAdmin: boolean;
  needsToAcceptTC: boolean;
  picture;
  profilePath: string;
  publicAlias: string;
  resourceType = 'user';
  signatureExpiryDate: number;
  signature: string;
  visibility: 'public' | 'private' | 'loggedin';

  constructor(store, userData) {
    // TODO do we need all these attributes to be observable?
    makeAutoObservable(this, {
      // anonymous: observable,
      // tenant: observable,
      // locale: observable,
      asBackend: computed,
    });
    this.store = store;

    this.anonymous = userData.anonymous;
    this.locale = userData.locale;
    this.tenant = userData.tenant;
    this.acceptedTC = userData.acceptedTC;
    this.profilePath = userData.profilePath;
    this.id = userData.id;
    this.displayName = userData.displayName;
    this.email = userData.email;
    this.emailPreferences = userData.emailPreferences;
  }

  get asBackend() {
    return {
      anon: this.anonymous,
      locale: this.locale,
      tenant: this.tenant.asBackend,
    };
  }
}
