/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MainIndividualNnaComponent } from './main-individual-nna.component';

describe('MainIndividualNnaComponent', () => {
  let component: MainIndividualNnaComponent;
  let fixture: ComponentFixture<MainIndividualNnaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainIndividualNnaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainIndividualNnaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
