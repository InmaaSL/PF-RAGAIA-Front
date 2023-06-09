/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PaidComponent } from './paid.component';

describe('PaidComponent', () => {
  let component: PaidComponent;
  let fixture: ComponentFixture<PaidComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaidComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
