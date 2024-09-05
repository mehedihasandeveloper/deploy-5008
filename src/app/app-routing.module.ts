import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CallRecordsComponent } from './components/call-records/call-records.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { FtpLoginManagementComponent } from './components/ftp-login-management/ftp-login-management.component';
import { ClientVoiceLogViewComponent } from './components/client-voice-log-view/client-voice-log-view.component';
import { ClientQCCommentComponent } from './components/client-qccomment/client-qccomment.component';
import { CampaignPermissionComponent } from './components/campaign-permission/campaign-permission.component';

const routes: Routes = [
  {path:'callRecords', component: CallRecordsComponent},
  {path:'userManagement', component: UserManagementComponent},
  {path:'login', component: LoginPageComponent},
  {path:'changePass', component: FtpLoginManagementComponent},
  {path:'clientCallRecords', component: ClientVoiceLogViewComponent},
  {path:'clientQCComments', component: ClientQCCommentComponent},
  {path:'campaignPermission', component: CampaignPermissionComponent},
  {path: '', component: LoginPageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
