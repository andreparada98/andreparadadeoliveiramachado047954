import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'XPagination',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './x-pagination.html',
  styleUrl: './x-pagination.scss'
})
export class XPaginationComponent {
  currentPage = input.required<number>();
  pageSize = input.required<number>();
  totalPages = input.required<number>();
  totalElements = input.required<number>();
  pageSizeOptions = input<number[]>([5, 10, 15, 20]);
  label = input<string>('Itens por página:');

  pageChange = output<number>();
  pageSizeChange = output<number>();

  onPageChange(page: number) {
    if (page >= 0 && page < this.totalPages()) {
      this.pageChange.emit(page);
    }
  }

  onPageSizeChange(size: number) {
    this.pageSizeChange.emit(Number(size));
  }
}

