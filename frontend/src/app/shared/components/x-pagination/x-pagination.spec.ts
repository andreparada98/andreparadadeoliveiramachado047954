import { ComponentFixture, TestBed } from '@angular/core/testing';
import { XPaginationComponent } from './x-pagination';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

describe('XPaginationComponent', () => {
  let component: XPaginationComponent;
  let fixture: ComponentFixture<XPaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [XPaginationComponent, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(XPaginationComponent);
    component = fixture.componentInstance;
    
    fixture.componentRef.setInput('currentPage', 0);
    fixture.componentRef.setInput('pageSize', 10);
    fixture.componentRef.setInput('totalPages', 5);
    fixture.componentRef.setInput('totalElements', 50);
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit pageChange when next button is clicked', () => {
    const spy = vi.fn();
    component.pageChange.subscribe(spy);
    
    const nextBtn = fixture.debugElement.queryAll(By.css('.page-btn'))[1].nativeElement;
    nextBtn.click();
    
    expect(spy).toHaveBeenCalledWith(1);
  });

  it('should not emit pageChange when current page is last page', () => {
    fixture.componentRef.setInput('currentPage', 4);
    fixture.detectChanges();
    
    const spy = vi.fn();
    component.pageChange.subscribe(spy);
    
    const nextBtn = fixture.debugElement.queryAll(By.css('.page-btn'))[1].nativeElement;
    nextBtn.click();
    
    expect(spy).not.toHaveBeenCalled();
  });

  it('should emit pageSizeChange when select changes', () => {
    const spy = vi.fn();
    component.pageSizeChange.subscribe(spy);
    
    const select = fixture.debugElement.query(By.css('select')).nativeElement;
    select.value = '20';
    select.dispatchEvent(new Event('change'));
    
    expect(spy).toHaveBeenCalledWith(20);
  });

  it('should display correct pagination info', () => {
    const pageInfo = fixture.debugElement.query(By.css('.page-info')).nativeElement;
    const totalCount = fixture.debugElement.query(By.css('.total-count')).nativeElement;
    expect(pageInfo.textContent).toContain('Página 1 de 5');
    expect(totalCount.textContent).toContain('Total: 50');
  });
});

