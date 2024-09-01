import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientQCCommentComponent } from './client-qccomment.component';

describe('ClientQCCommentComponent', () => {
  let component: ClientQCCommentComponent;
  let fixture: ComponentFixture<ClientQCCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClientQCCommentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientQCCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
