import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FtpLoginManagementComponent } from './ftp-login-management.component';

describe('FtpLoginManagementComponent', () => {
  let component: FtpLoginManagementComponent;
  let fixture: ComponentFixture<FtpLoginManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FtpLoginManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FtpLoginManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
