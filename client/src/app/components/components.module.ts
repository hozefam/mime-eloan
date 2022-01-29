import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HijriCustomComponent } from './hijri-custom/hijri-custom.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { DocumentListComponent } from './document-list/document-list.component';
import { CommonCommentsComponent } from './common-comments/common-comments.component';
import { NbCardModule } from '@nebular/theme';
import { ToastrModule } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';
import { NgxEditorModule } from 'ngx-editor';
import { MatRadioModule } from '@angular/material/radio';
import { CKEditorModule } from 'ng2-ckeditor';
import { InputsTableComponent } from './inputs-table/inputs-table.component';

@NgModule({

  imports: [

    CommonModule,
    FormsModule,
    NbCardModule,
    TranslateModule,
    NgxEditorModule,
    CKEditorModule,
    MatRadioModule,
    NgbModule.forRoot(),
    ToastrModule.forRoot(),

  ],

  declarations: [HijriCustomComponent, DocumentListComponent, CommonCommentsComponent, InputsTableComponent],

  exports: [HijriCustomComponent, DocumentListComponent, CommonCommentsComponent, InputsTableComponent],

})

export class ComponentsModule { }
