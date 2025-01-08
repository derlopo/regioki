import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompanyDetailsTableComponent } from './company-details-table.component';

describe('CompanyDetailsTableComponent', () => {
  let component: CompanyDetailsTableComponent;
  let fixture: ComponentFixture<CompanyDetailsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyDetailsTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CompanyDetailsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
