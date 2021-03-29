import { Prop, Component, h } from '@stencil/core';

import { flowResult } from 'mobx';
import rootStore from '../../stores/root-store';
import { ActivityStore } from '../../stores/activity-store';

import anylogger from 'anylogger';
const log = anylogger('oae-dashboard');

import '@polymer/iron-icons/iron-icons.js';
import { actionSheetController } from '@ionic/core';

@Component({
  tag: 'oae-dashboard',
  styleUrl: 'oae-dashboard.scss',
})
export class Dashboard {
  @Prop({ mutable: true }) activityItems = [];

  componentWillLoad() {
    // Check if user is logged in, if not, redirect to signin page
    const userStore = rootStore.userStore;
    const activityStore = new ActivityStore(rootStore);

    return flowResult(userStore.getCurrentUser())
      .then(currentUser => {
        userStore.setCurrentUser(currentUser);
      })
      .then(() => flowResult(activityStore.fetchUserActivities()))
      .then(activities => {
        // TODO
        log.debug('Processed activities');
        log.debug(activityStore.processedActivities);

        this.setActivityItems(activities.items);
        debugger;
      });
  }

  setActivityItems(activities) {
    this.activityItems = activities;
    debugger;
  }

  render() {
    return (
      <oae-layout>
        <div>
          {this.activityItems.map(eachActivity => (
            <oae-newsfeed key={eachActivity['oae:activityId']} activityItem={eachActivity} />
          ))}
        </div>
      </oae-layout>
    );
  }
}
