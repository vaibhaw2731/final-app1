import { browser, element, by, protractor } from 'protractor';

import NavBarPage from './../../../page-objects/navbar-page';
import SignInPage from './../../../page-objects/signin-page';
import LeaveRequestComponentsPage, { LeaveRequestDeleteDialog } from './leave-request.page-object';
import LeaveRequestUpdatePage from './leave-request-update.page-object';
import { waitUntilDisplayed, waitUntilHidden } from '../../../util/utils';

const expect = chai.expect;

describe('LeaveRequest e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let leaveRequestComponentsPage: LeaveRequestComponentsPage;
  let leaveRequestUpdatePage: LeaveRequestUpdatePage;
  let leaveRequestDeleteDialog: LeaveRequestDeleteDialog;

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

  it('should load LeaveRequests', async () => {
    await navBarPage.getEntityPage('leave-request');
    leaveRequestComponentsPage = new LeaveRequestComponentsPage();
    expect(await leaveRequestComponentsPage.getTitle().getText()).to.match(/Leave Requests/);
  });

  it('should load create LeaveRequest page', async () => {
    await leaveRequestComponentsPage.clickOnCreateButton();
    leaveRequestUpdatePage = new LeaveRequestUpdatePage();
    expect(await leaveRequestUpdatePage.getPageTitle().getAttribute('id')).to.match(/uiApp.leaveLeaveRequest.home.createOrEditLabel/);
    await leaveRequestUpdatePage.cancel();
  });

 
  after(async () => {
    await navBarPage.autoSignOut();
  });
});
