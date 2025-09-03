import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ActivatedRoute } from '@angular/router';
import * as mammoth from 'mammoth';
import { ContractServiceService } from '../../shared/Services/contract-service.service';
import { ContractItem } from '../../shared/interfaces/contracts-list-response';
import saveAs from 'file-saver';

// ✅ استيراد مكتبة docx
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-contract-editor',
  standalone: true,
  imports: [CommonModule, AngularEditorModule, FormsModule],
  templateUrl: './contract-editor.component.html',
  styleUrls: ['./contract-editor.component.css']
})
export class ContractEditorComponent implements OnInit {
  htmlContent: string = '';
  activeTitle: string = '';
  activeContract!: ContractItem | null;
  isBrowser: boolean;

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '250px',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    toolbarPosition: 'top',
    defaultFontName: 'Arial',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'tahoma', name: 'Tahoma' }
    ],
    sanitize: false
  };

  constructor(
    private route: ActivatedRoute,
    private contractService: ContractServiceService,
    private toastr: ToastrService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;

    this.route.queryParams.subscribe(params => {
      const title = params['title'];
      if (title) {
        this.loadContractByTitle(title);
      }
    });
  }

  // ------------- تحميل العقد مع تحويل أي رابط إلى https
  loadContractByTitle(title: string): void {
    if (!this.isBrowser) return;

    this.contractService.getContracts().subscribe({
      next: (contracts: ContractItem[]) => {
        const normalizedContracts = contracts.map(c => ({
          ...c,
          fileUrl: c.fileUrl?.startsWith('http://')
            ? c.fileUrl.replace('http://', 'https://')
            : c.fileUrl,
          imageUrl: c.imageUrl?.startsWith('http://')
            ? c.imageUrl.replace('http://', 'https://')
            : c.imageUrl
        }));

        const contract = normalizedContracts.find(c => c.title === title);
        if (contract) {
          this.activeContract = contract;
          this.activeTitle = contract.title;

          const safeUrl = encodeURI(contract.fileUrl);

          fetch(safeUrl)
            .then(response => response.arrayBuffer())
            .then(buffer => {
              mammoth.convertToHtml({ arrayBuffer: buffer })
                .then(result => {
                  this.htmlContent = result.value;
                })
                .catch(err => console.error('Error parsing DOCX:', err));
            })
            .catch(err => console.error('Error fetching DOCX:', err));
        } else {
          console.error('Contract not found for title:', title);
        }
      },
      error: (err) => console.error('Error fetching contracts:', err)
    });
  }

  // ------------- تحميل PDF
  downloadPdf() {
    if (!this.isBrowser) return;

    import('html2canvas').then(html2canvas => {
      import('jspdf').then(jsPDF => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = this.htmlContent;

        tempDiv.style.direction = 'rtl';
        tempDiv.style.fontFamily = 'Cairo, sans-serif';
        tempDiv.style.padding = '20px';
        tempDiv.style.width = '800px';
        tempDiv.style.background = '#fff';
        tempDiv.style.boxSizing = 'border-box';

        document.body.appendChild(tempDiv);

        html2canvas.default(tempDiv, { scale: 2, useCORS: true }).then(canvas => {
          const pdf = new jsPDF.default('p', 'mm', 'a4');
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          const margin = 10;
          const contentWidth = pdfWidth - margin * 2;
          const pxPerMm = canvas.width / contentWidth;
          const pageHeightPx = (pdfHeight - margin * 2) * pxPerMm;

          let heightLeft = canvas.height;
          let position = 0;

          while (heightLeft > 0) {
            const pageHeight = Math.min(pageHeightPx, heightLeft);
            const canvasPage = document.createElement('canvas');
            canvasPage.width = canvas.width;
            canvasPage.height = pageHeight;
            const ctx = canvasPage.getContext('2d')!;
            ctx.drawImage(canvas, 0, position, canvas.width, pageHeight, 0, 0, canvas.width, pageHeight);

            const imgData = canvasPage.toDataURL('image/png');
            pdf.addImage(imgData, 'PNG', margin, margin, contentWidth, pageHeight / pxPerMm);

            heightLeft -= pageHeight;
            position += pageHeight;

            if (heightLeft > 0) pdf.addPage();
          }

          pdf.save(`${this.activeTitle || 'contract'}.pdf`);
          document.body.removeChild(tempDiv);
        });
      });
    });
  }

  // ------------- حفظ التعديلات وإرسال DOCX للـ API
  async saveContractEdits() {
    if (!this.htmlContent) return;

    try {
      const parser = new DOMParser();
      const docParsed = parser.parseFromString(this.htmlContent, 'text/html');
      const paragraphs: Paragraph[] = [];

      docParsed.body.querySelectorAll('p, div, h1, h2, h3').forEach(el => {
        const text = el.textContent?.trim() || '';
        if (text) {
          const style = (el as HTMLElement).style;
          const computedStyle = window.getComputedStyle(el as HTMLElement);

          // قراءة المحاذاة والاتجاه من inline style أولاً ثم من computed
          const direction = style.direction || computedStyle.direction || 'ltr';
          const textAlign = style.textAlign || computedStyle.textAlign || 'left';

          // تحويل القيم إلى الصيغة الصحيحة لـ docx
          let alignment: 'left' | 'right' | 'center' = 'left';
          if (textAlign.toLowerCase() === 'center') alignment = 'center';
          else if (textAlign.toLowerCase() === 'right') alignment = 'right';

          paragraphs.push(
            new Paragraph({
              alignment,
              bidirectional: direction === 'rtl',
              children: [
                new TextRun({
                  text,
                  font: 'Arial',
                }),
              ],
            })
          );
        }
      });


      const doc = new Document({
        sections: [{ children: paragraphs }]
      });

      const blob = await Packer.toBlob(doc);

      const file = new File([blob], `${this.activeTitle || 'contract'}.docx`, {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      });

      this.contractService.uploadTemplate(file).subscribe({
        next: (res) => {
          console.log('تم الحفظ بنجاح ✅', res);
          this.toastr.success('تم حفظ التعديلات بنجاح!✅');
        },
        error: (err) => {
          console.error('Error uploading DOCX:', err);
          this.toastr.error('حصل خطأ أثناء رفع العقد');
        }
      });
    } catch (error) {
      console.error('Error generating DOCX:', error);
    }
  }
}