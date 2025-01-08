import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MultiImgUploadComponent } from './multi-img-upload.component';

describe('MultiImgUploadComponent', () => {
  let component: MultiImgUploadComponent;
  let fixture: ComponentFixture<MultiImgUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiImgUploadComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MultiImgUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
