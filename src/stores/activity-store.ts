import { flowResult, computed, autorun, makeAutoObservable, observable, flow } from 'mobx';
import { both, assocPath, equals, prop, compose, assoc, map } from 'ramda';

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
    const currentUser = this.rootStore.userStore.currentUser;
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

      eachActivity = assoc('actor', this.parseActivityActor(eachActivity.actor, currentUser), eachActivity);
      const activityItem = new ActivityItem(eachActivity);
      return activityItem;
    };

    return map(processActivity, this.activities);
  }

  // Use the most up-to-date profile picture when available
  parseActivityActor(eachActivityActor, currentUser) {
    const copySmallPictureFromCurrentUser = assocPath(['picture', 'small'], currentUser.smallPicture);
    const copyMediumPictureFromCurrentUser = assocPath(['picture', 'medium'], currentUser.mediumPicture);
    const copyLargePictureFromCurrentUser = assocPath(['picture', 'large'], currentUser.largePicture);

    const getActorId = prop('oae:id');
    const hasAnyPicture = prop('hasAnyPicture');
    const sameAsActivityActor = compose(equals(getActorId(eachActivityActor)), prop('id'));
    const isCurrentUserTheActorAndDoesItHavePictures = both(sameAsActivityActor, hasAnyPicture)(currentUser);

    if (isCurrentUserTheActorAndDoesItHavePictures) {
      eachActivityActor = compose(copySmallPictureFromCurrentUser, copyMediumPictureFromCurrentUser, copyLargePictureFromCurrentUser)(eachActivityActor);
    } else {
      // TODO simplify
      if (eachActivityActor.image && eachActivityActor.image.url) {
        eachActivityActor.thumbnailUrl = eachActivityActor.image.url;
      }

      // TODO simplify
      if (eachActivityActor['oae:wideImage'] && eachActivityActor['oae:wideImage'].url) {
        eachActivityActor.wideImageUrl = eachActivityActor['oae:wideImage'].url;
      }

      // TODO simplify
      if (eachActivityActor['oae:mimeType']) {
        eachActivityActor.mime = eachActivityActor['oae:mimeType'];
      }
    }

    return eachActivityActor;
  }
}
