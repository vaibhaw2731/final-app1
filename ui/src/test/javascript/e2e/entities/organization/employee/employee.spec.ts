import { browser, element, by } from 'protractor';

import NavBarPage from './../../../page-objects/navbar-page';
import SignInPage from './../../../page-objects/signin-page';
import EmployeeComponentsPage, { EmployeeDeleteDialog } from './employee.page-object';
import EmployeeUpdatePage from './employee-update.page-object';
import { waitUntilDisplayed, waitUntilHidden } from '../../../util/utils';

const expect = chai.expect;

describe('Employee e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let employeeComponentsPage: EmployeeComponentsPage;
  let employeeUpdatePage: EmployeeUpdatePage;
  /* let employeeDeleteDialog: EmployeeDeleteDialog; */

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

  it('should load Employees', async () => {
    await navBarPage.getEntityPage('employee');
    employeeComponentsPage = new EmployeeComponentsPage();
    expect(await employeeComponentsPage.getTitle().getText()).to.match(/Employees/);
  });

  it('should load create Employee page', async () => {
    await employeeComponentsPage.clickOnCreateButton();
    employeeUpdatePage = new EmployeeUpdatePage();
    expect(await employeeUpdatePage.getPageTitle().getAttribute('id')).to.match(/uiApp.organizationEmployee.home.createOrEditLabel/);
    await employeeUpdatePage.cancel();
  });

  /*  it('should create and save Employees', async () => {
        async function createEmployee() {
            await employeeComponentsPage.clickOnCreateButton();
            await employeeUpdatePage.setCodeInput('code');
            expect(await employeeUpdatePage.getCodeInput()).to.match(/code/);
            await employeeUpdatePage.setFirstNameInput('firstName');
            expect(await employeeUpdatePage.getFirstNameInput()).to.match(/firstName/);
            await employeeUpdatePage.setLastNameInput('lastName');
            expect(await employeeUpdatePage.getLastNameInput()).to.match(/lastName/);
            await employeeUpdatePage.genderSelectLastOption();
            await employeeUpdatePage.setEmailInput('M*&gt;tWA/&#34;yc|NG`bsrp)gW}$fpUlp@6ke5eah8qHBytce?2&amp;GTCY+VszAf;M\S}&amp;dq)B&#39;?&#34;Xd)m&amp;&lt;TN&amp;k.j6nC&amp;\r&#34;aTVo*+qFS&gt;&amp;Y&lt;sxD]&#39;{f1tD_!7zJf&#34;zkUsNq&#34;1tC;D7su9,UfO#AM!4I/%{Y~Wlk.tWYP&lt;w,p`w:[nE&#39;ZIEZM');
            expect(await employeeUpdatePage.getEmailInput()).to.match(/M*&gt;tWA/&#34;yc|NG`bsrp)gW}$fpUlp@6ke5eah8qHBytce?2&amp;GTCY+VszAf;M\S}&amp;dq)B&#39;?&#34;Xd)m&amp;&lt;TN&amp;k.j6nC&amp;\r&#34;aTVo*+qFS&gt;&amp;Y&lt;sxD]&#39;{f1tD_!7zJf&#34;zkUsNq&#34;1tC;D7su9,UfO#AM!4I/%{Y~Wlk.tWYP&lt;w,p`w:[nE&#39;ZIEZM/);
            await employeeUpdatePage.setPhoneInput('phone');
            expect(await employeeUpdatePage.getPhoneInput()).to.match(/phone/);
            await employeeUpdatePage.setAddressLine1Input('addressLine1');
            expect(await employeeUpdatePage.getAddressLine1Input()).to.match(/addressLine1/);
            await employeeUpdatePage.setAddressLine2Input('addressLine2');
            expect(await employeeUpdatePage.getAddressLine2Input()).to.match(/addressLine2/);
            await employeeUpdatePage.setCityInput('city');
            expect(await employeeUpdatePage.getCityInput()).to.match(/city/);
            await employeeUpdatePage.setCountryInput('country');
            expect(await employeeUpdatePage.getCountryInput()).to.match(/country/);
            await employeeUpdatePage.departmentSelectLastOption();
            await waitUntilDisplayed(employeeUpdatePage.getSaveButton());
            await employeeUpdatePage.save();
            await waitUntilHidden(employeeUpdatePage.getSaveButton());
            expect(await employeeUpdatePage.getSaveButton().isPresent()).to.be.false;
        }

        await createEmployee();
        await employeeComponentsPage.waitUntilLoaded();
        const nbButtonsBeforeCreate = await employeeComponentsPage.countDeleteButtons();
        await createEmployee();

        await employeeComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeCreate + 1);
        expect(await employeeComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
    }); */

  /*  it('should delete last Employee', async () => {
        await employeeComponentsPage.waitUntilLoaded();
        const nbButtonsBeforeDelete = await employeeComponentsPage.countDeleteButtons();
        await employeeComponentsPage.clickOnLastDeleteButton();

        const deleteModal = element(by.className('modal'));
        await waitUntilDisplayed(deleteModal);

        employeeDeleteDialog = new EmployeeDeleteDialog();
        expect(await employeeDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/uiApp.organizationEmployee.delete.question/);
        await employeeDeleteDialog.clickOnConfirmButton();

        await employeeComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeDelete - 1);
        expect(await employeeComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    }); */

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
