import { flowResult, computed, autorun, makeAutoObservable, observable, flow, action, isComputed } from 'mobx';
import { map } from 'ramda';

import anylogger from 'anylogger';
const log = anylogger('activity-store');

import { ActivityItem } from '../models/activity';
import { User } from '../models/user';
import { RootStore } from './root-store';

export class ActivityStore {
  rootStore: RootStore;
  primaryActor: User;
  activities: ActivityItem[];

  constructor(rootStore) {
    // TODO do we need all these attributes to be observable?
    makeAutoObservable(this, {
      primaryActor: observable,
      activities: observable,
      fetchUserActivities: flow,
      processedActivities: computed,
    });
    autorun(() => {
      // Some action we might need to run just once
    });
    this.rootStore = rootStore;
    // flowResult(this.fetchUserActivities());
    // this.fetchUserActivities();
    /*
    this.syncActivities().then(activities => {
      this.setActivities(activities);
    });
    */
  }

  /**
   * Using flow instead of async / await
   * Check more info here:
   * https://mobx.js.org/actions.html#using-flow-instead-of-async--await-
   */
  *fetchUserActivities() {
    try {
      const response = yield fetch('/api/activity');
      const data = yield response.json();

      this.activities = data.items;

      return data;
    } catch (error: unknown) {
      log.error(`Unable to get user activities from the API`, error);
    }
  }

  // generatePrimaryActor() {}

  // generateActivityPreviewItems() {}

  get processedActivities() {
    const processActivity = eachActivity => {
      // Move the relevant items (comments, previews, ..) to the top
      // _prepareActivity(me, eachActivity);

      // Generate an i18nable summary for this activity
      // const summary = _generateSummary(me, eachActivity, sanitization, opts);

      // Generate the primary actor view
      // const primaryActor = generatePrimaryActor(me, eachActivity);

      // Generate the activity preview items
      // const activityItems = generateActivityPreviewItems(context, eachActivity);

      // Construct the adapted activity
      // return new ActivityItem(eachActivity, summary, primaryActor, activityItems);

      // return eachActivity;
      return new ActivityItem(eachActivity);
    };

    return map(processActivity, this.activities);
    // return this.activities;
  }
}
