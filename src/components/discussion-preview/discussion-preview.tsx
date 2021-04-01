import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'discussion-preview',
  styleUrl: 'discussion-preview.css',
})
export class DiscussionPreview {
  @Prop() discussionId: string;

  componentWillLoad() {}

  render() {
    return (
      <section class="column news-feed-message">
        <h5>Group assignment briefing</h5>
        <p>Here is the briefing for that group assignment we talked about.</p>
        <oae-tag></oae-tag>
      </section>
    );
  }
}
