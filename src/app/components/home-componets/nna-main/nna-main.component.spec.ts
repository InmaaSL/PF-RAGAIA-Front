/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NnaMainComponent } from './nna-main.component';

describe('NnaMainComponent', () => {
  let component: NnaMainComponent;
  let fixture: ComponentFixture<NnaMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NnaMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NnaMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
