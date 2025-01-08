import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppsNevigateComponent } from './apps-navigate.component';

describe('AppsNevigateComponent', () => {
  let component: AppsNavigateComponent;
  let fixture: ComponentFixture<AppsNavigateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppsNavigateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppsNavigateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
