import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VocabularyQuizPageComponent } from './vocabulary-quiz-page.component';

describe('VocabularyQuizPageComponent', () => {
  let component: VocabularyQuizPageComponent;
  let fixture: ComponentFixture<VocabularyQuizPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VocabularyQuizPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VocabularyQuizPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
