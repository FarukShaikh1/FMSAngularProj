import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseComponent } from './ExpenseComponent';

describe('ExpenseComponent', () => {
  let component: ExpenseComponent;
  let fixture: ComponentFixture<ExpenseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExpenseComponent]
    });
    fixture = TestBed.createComponent(ExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
