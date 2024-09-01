import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CallRecordsComponent } from './components/call-records/call-records.component';
import { UserManagementComponent } from './components/user-management/user-management.component';

import { HttpClientModule } from '@angular/common/http';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FtpLoginManagementComponent } from './components/ftp-login-management/ftp-login-management.component';
import { ClientVoiceLogViewComponent } from './components/client-voice-log-view/client-voice-log-view.component';
import { ClientQCCommentComponent } from './components/client-qccomment/client-qccomment.component';
import { CampaignPermissionComponent } from './components/campaign-permission/campaign-permission.component';

@NgModule({
  declarations: [
    AppComponent,
    CallRecordsComponent,
    UserManagementComponent,
    LoginPageComponent,
    FtpLoginManagementComponent,
    ClientVoiceLogViewComponent,
    ClientQCCommentComponent,
    CampaignPermissionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
