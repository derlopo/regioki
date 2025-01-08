import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImagesUploadComponent } from './images-upload.component';

describe('ImagesUploadComponent', () => {
  let component: ImagesUploadComponent;
  let fixture: ComponentFixture<ImagesUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImagesUploadComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ImagesUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
