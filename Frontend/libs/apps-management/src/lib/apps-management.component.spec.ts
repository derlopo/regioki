import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppsManagementComponent } from './apps-management.component';

describe('AppsManagementComponent', () => {
  let component: AppsManagementComponent;
  let fixture: ComponentFixture<AppsManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppsManagementComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
