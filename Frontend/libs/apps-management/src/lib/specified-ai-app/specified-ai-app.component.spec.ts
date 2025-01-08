import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpecifiedAiAppComponent } from './specified-ai-app.component';

describe('SpecifiedAiAppComponent', () => {
  let component: SpecifiedAiAppComponent;
  let fixture: ComponentFixture<SpecifiedAiAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecifiedAiAppComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SpecifiedAiAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
