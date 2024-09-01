import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientVoiceLogViewComponent } from './client-voice-log-view.component';

describe('ClientVoiceLogViewComponent', () => {
  let component: ClientVoiceLogViewComponent;
  let fixture: ComponentFixture<ClientVoiceLogViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClientVoiceLogViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientVoiceLogViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
