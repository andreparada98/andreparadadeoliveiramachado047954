import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer';
import { HealthService } from '../../../services/health.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let healthServiceSpy: any;

  beforeEach(async () => {
    healthServiceSpy = {
      pollLiveness: vi.fn().mockReturnValue(of(true)),
      pollReadiness: vi.fn().mockReturnValue(of(false))
    };

    await TestBed.configureTestingModule({
      imports: [FooterComponent],
      providers: [
        { provide: HealthService, useValue: healthServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display status UP for liveness', () => {
    const livenessText = fixture.debugElement.queryAll(By.css('.status-text'))[0].nativeElement;
    expect(livenessText.textContent).toContain('UP');
    
    const dot = fixture.debugElement.queryAll(By.css('.status-dot'))[0].nativeElement;
    expect(dot.classList).toContain('up');
  });

  it('should display status DOWN for readiness', () => {
    const readinessText = fixture.debugElement.queryAll(By.css('.status-text'))[1].nativeElement;
    expect(readinessText.textContent).toContain('DOWN');
    
    const dot = fixture.debugElement.queryAll(By.css('.status-dot'))[1].nativeElement;
    expect(dot.classList).toContain('down');
  });
});

