import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginationPageComponent } from './pagination-page.component';

describe('PaginationPageComponent', () => {
  let component: PaginationPageComponent;
  let fixture: ComponentFixture<PaginationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
