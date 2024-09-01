import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignPermissionComponent } from './campaign-permission.component';

describe('CampaignPermissionComponent', () => {
  let component: CampaignPermissionComponent;
  let fixture: ComponentFixture<CampaignPermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CampaignPermissionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampaignPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
