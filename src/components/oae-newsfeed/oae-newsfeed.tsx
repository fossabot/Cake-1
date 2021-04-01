import { Component, h, Prop } from '@stencil/core';

import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icons/social-icons.js';
import '@polymer/iron-icons/av-icons.js';
import '@polymer/iron-icons/hardware-icons.js';
import '@polymer/iron-icons/communication-icons.js';

import { formatDistance } from 'date-fns';
import { humanizeActivityVerb } from '../../helpers/activity';
import anylogger from 'anylogger';
const log = anylogger('oae-newsfeed');

@Component({
  tag: 'oae-newsfeed',
  styleUrl: 'oae-newsfeed.scss',
})
export class NewsFeed {
  @Prop({ mutable: true }) activityItem;
  @Prop() key; // TODO: mandatory otherwise ts throws error?

  componentWillLoad() {
    log.debug('Component is about to be rendered, here are the details');
    log.debug(this.activityItem);
  }

  render() {
    let renderPreview;
    if (this.activityItem.object.objectType === 'discussion') {
      renderPreview = <discussion-preview discussionId={this.activityItem.object.id}></discussion-preview>;
    }
    return (
      <div class="box box-feed">
        <div class="content news-feed">
          <nav class="level news-feed-top">
            <div class="level-left">
              <div class="level-item">
                <div class="column is-flex news-feed-nav">
                  <figure class="image avatar-news-feed">
                    <img class="is-rounded avatar-news-feed" src={this.activityItem.primaryActor.mediumPicture} />
                  </figure>
                  <section>
                    <p class="user-info">
                      <a class="feed-user">{this.activityItem.primaryActor.displayName}</a>
                      {humanizeActivityVerb(this.activityItem.verb)} a {this.activityItem.object.objectType}
                      <span class="panel-icon icon-feed">
                        <iron-icon icon="icons:cloud-upload"></iron-icon>
                      </span>
                    </p>
                    <p>{formatDistance(this.activityItem.published, new Date(), { addSuffix: true })}</p>
                  </section>
                </div>
              </div>
            </div>
            <div class="level-right">
              <p class="level-item">
                <button class="button news-pin">
                  <iron-icon icon="icons:more-vert"></iron-icon>
                </button>
              </p>
            </div>
          </nav>
          {renderPreview}
          <nav class="level bottom-nav-news">
            <div class="level-left">
              <div class="level-item">
                <a class="button comments-button">
                  <span class="comments-icon">
                    <iron-icon icon="communication:forum"></iron-icon>
                  </span>
                  <span>View (25) comments</span>
                </a>
              </div>
              <div class="level-item">
                <a class="button reply-button">
                  <span class="reply-icon">
                    <iron-icon icon="communication:import-export"></iron-icon>
                  </span>
                  <span>Reply</span>
                </a>
              </div>
            </div>
          </nav>
        </div>
      </div>
    );
  }
}
