import { Component, Input } from '@angular/core';
import { FileData } from '../../../shared/models/file-data.model';

@Component({
  selector: 'app-local-file',
  templateUrl: './local-file.component.html',
})
export class LocalFileComponent {
  @Input() file: FileData | null = null;
}
