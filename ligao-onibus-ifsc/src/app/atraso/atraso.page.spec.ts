import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AtrasoPage } from './atraso.page';

describe('AtrasoPage', () => {
  let component: AtrasoPage;
  let fixture: ComponentFixture<AtrasoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AtrasoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
