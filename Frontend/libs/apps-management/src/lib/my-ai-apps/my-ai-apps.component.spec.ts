import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyAiAppsComponent } from './my-ai-apps.component';

describe('MyAiAppsComponent', () => {
  let component: MyAiAppsComponent;
  let fixture: ComponentFixture<MyAiAppsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyAiAppsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MyAiAppsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
