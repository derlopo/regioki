import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AiAppCardComponent } from './ai-app-card.component';

describe('AiAppCardComponent', () => {
  let component: AiAppCardComponent;
  let fixture: ComponentFixture<AiAppCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiAppCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AiAppCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
