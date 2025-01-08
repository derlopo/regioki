import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateCompanyUserComponent } from './create-company-user.component';

describe('CreateCompanyUserComponent', () => {
  let component: CreateCompanyUserComponent;
  let fixture: ComponentFixture<CreateCompanyUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateCompanyUserComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateCompanyUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
