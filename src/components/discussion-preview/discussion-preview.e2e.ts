import { newE2EPage } from '@stencil/core/testing';

describe('discussion-preview', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<discussion-preview></discussion-preview>');
    const element = await page.find('discussion-preview');
    expect(element).toHaveClass('hydrated');
  });{cursor}
});
