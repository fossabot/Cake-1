/* eslint-disable import/no-unassigned-import, new-cap, @typescript-eslint/promise-function-async */
import { Component, h, Prop, Element, State } from '@stencil/core';

import '@material/mwc-dialog';
import '@material/mwc-button';
import '@material/mwc-textfield';

import rootStore from '../../stores/root-store';
import { prop, map, values, pipe, last, split, equals } from 'ramda';
import anylogger from 'anylogger';
const log = anylogger('home-nav');

import { flowResult } from 'mobx';
const DEFAULT_LOGO = 'oae-logo.svg';
const isLoggedIn = prop('loggedIn');

@Component({
  tag: 'home-nav',
  styleUrl: 'home-nav.scss',
})
export class HomeNav {
  @Prop() tenantAlias: string;
  @Prop({ mutable: true }) tenantLogo: string;
  @Prop() authStrategyInfo: any = {};
  @Element() element;
  @State() isUserLoggedIn: boolean;

  showSignInModal = () => {
    const dialog = this.element.querySelector('mwc-dialog');
    dialog.open = true;
  };

  componentWillLoad() {
    return fetch('/api/ui/logo')
      .then(response => response.text())
      .then(text => {
        // TODO we need to change the backend to deliver the correct filepath if default
        const isDefaultLogo = pipe(split('/'), last, equals(DEFAULT_LOGO))(text);

        let logoToDisplay;
        if (isDefaultLogo) {
          logoToDisplay = './assets/logo/oae-logo.svg';
        } else {
          logoToDisplay = text;
        }
        this.tenantLogo = logoToDisplay;
      })
      .then(() => {
        // Check whether user is logged in or not
        const userStore = rootStore.userStore;
        return flowResult(userStore.getCurrentUser());
      })
      .then(currentUser => {
        this.isUserLoggedIn = isLoggedIn(currentUser);
      })
      .catch(error => {
        log.error(`Error fetching the tenant logo`, error);
      });
  }

  getHeadingForDialog() {
    return `Sign in to ${this.tenantAlias}`;
  }

  render() {
    let externalAuth: any;
    let localAuth;
    let loginAndSignUpButtons;
    let showUserAvatar;
    if (this.isUserLoggedIn) {
      log.debug('User is logged in, yay!');
      showUserAvatar = <div>USER AVATAR</div>;
    } else {
      log.debug('User is NOT logged in, yay!');
      if (this.authStrategyInfo.hasExternalAuth) {
        externalAuth = pipe(
          values,
          map(eachStrategy => <external-auth-strategy icon={eachStrategy.icon} id={eachStrategy.id} url={eachStrategy.url} name={eachStrategy.name} />),
        )(this.authStrategyInfo.enabledExternalStrategies);
      }

      if (this.authStrategyInfo.hasLocalAuth) {
        localAuth = <local-auth-strategy enabledStrategies={this.authStrategyInfo.enabledStrategies} />;
      }

      loginAndSignUpButtons = (
        <div class="buttons">
          <mwc-dialog id="dialog" heading={this.getHeadingForDialog()}>
            {externalAuth}
            {localAuth}
            <mwc-button slot="secondaryAction" dialogAction="close">
              Cancel
            </mwc-button>
          </mwc-dialog>
          <a class="button is-round register-button">Register</a>
          <a onClick={this.showSignInModal} class="button is-round signIn-button">
            Sign In
          </a>
        </div>
      );
    }

    return (
      <div>
        <nav class="navbar home-nav">
          <div class="navbar-brand">
            <a class="navbar-item logo" href="#">
              <img src={this.tenantLogo} />
            </a>
          </div>
          <div class="navbar-end navEnd">
            <div class="navbar-item">{this.isUserLoggedIn ? showUserAvatar : loginAndSignUpButtons}</div>
          </div>
        </nav>
      </div>
    );
  }
}
