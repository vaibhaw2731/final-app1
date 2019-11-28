import { browser, element, by } from 'protractor';

import NavBarPage from './../../../page-objects/navbar-page';
import SignInPage from './../../../page-objects/signin-page';
import EmployeeLeaveComponentsPage, { EmployeeLeaveDeleteDialog } from './employee-leave.page-object';
import EmployeeLeaveUpdatePage from './employee-leave-update.page-object';
import { waitUntilDisplayed, waitUntilHidden } from '../../../util/utils';

const expect = chai.expect;

describe('EmployeeLeave e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let employeeLeaveComponentsPage: EmployeeLeaveComponentsPage;
  let employeeLeaveUpdatePage: EmployeeLeaveUpdatePage;
  let employeeLeaveDeleteDialog: EmployeeLeaveDeleteDialog;

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

  it('should load EmployeeLeaves', async () => {
    await navBarPage.getEntityPage('employee-leave');
    employeeLeaveComponentsPage = new EmployeeLeaveComponentsPage();
    expect(await employeeLeaveComponentsPage.getTitle().getText()).to.match(/Employee Leaves/);
  });

  it('should load create EmployeeLeave page', async () => {
    await employeeLeaveComponentsPage.clickOnCreateButton();
    employeeLeaveUpdatePage = new EmployeeLeaveUpdatePage();
    expect(await employeeLeaveUpdatePage.getPageTitle().getAttribute('id')).to.match(/uiApp.leaveEmployeeLeave.home.createOrEditLabel/);
    await employeeLeaveUpdatePage.cancel();
  });


  after(async () => {
    await navBarPage.autoSignOut();
  });
});
