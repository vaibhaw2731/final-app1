import { browser, element, by } from 'protractor';

import NavBarPage from './../../../page-objects/navbar-page';
import SignInPage from './../../../page-objects/signin-page';
import MeetingRoomComponentsPage, { MeetingRoomDeleteDialog } from './meeting-room.page-object';
import MeetingRoomUpdatePage from './meeting-room-update.page-object';
import { waitUntilDisplayed, waitUntilHidden } from '../../../util/utils';

const expect = chai.expect;

describe('MeetingRoom e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let meetingRoomComponentsPage: MeetingRoomComponentsPage;
  let meetingRoomUpdatePage: MeetingRoomUpdatePage;
  let meetingRoomDeleteDialog: MeetingRoomDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.waitUntilDisplayed();

    await signInPage.username.sendKeys('admin');
    await signInPage.password.sendKeys('admin');
    await signInPage.loginButton.click();
    await signInPage.waitUntilHidden();
    await waitUntilDisplayed(navBarPage.entityMenu);
  });




  
  after(async () => {
    await navBarPage.autoSignOut();
  });
});
