import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-export-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './export-page.component.html',
  styleUrl: './export-page.component.scss'
})
export class ExportPageComponent {
  matricule = '';
  department = '';
  dateFrom = '';
  dateTo = '';
}
