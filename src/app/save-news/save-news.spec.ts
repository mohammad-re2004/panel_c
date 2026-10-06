import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveNews } from './save-news';

describe('SaveNews', () => {
  let component: SaveNews;
  let fixture: ComponentFixture<SaveNews>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaveNews],
    }).compileComponents();

    fixture = TestBed.createComponent(SaveNews);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
