import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TablaCoordComponent } from './tabla-coord.component';

describe('TablaCoordComponent', () => {
  let component: TablaCoordComponent;
  let fixture: ComponentFixture<TablaCoordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TablaCoordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaCoordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
