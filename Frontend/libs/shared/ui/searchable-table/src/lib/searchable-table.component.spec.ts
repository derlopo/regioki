import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchableTableComponent } from './searchable-table.component';

describe('SearchableTableComponent', () => {
  let component: SearchableTableComponent;
  let fixture: ComponentFixture<SearchableTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchableTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchableTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
