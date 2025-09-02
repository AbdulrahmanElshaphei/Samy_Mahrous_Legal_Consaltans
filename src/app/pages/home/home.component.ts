import { NgFor, NgIf } from '@angular/common';
import { Component, AfterViewInit, ViewChild, ElementRef, OnDestroy, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import EmblaCarousel from 'embla-carousel';
import emailjs from 'emailjs-com';
import { ToastrService } from 'ngx-toastr';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgFor, RouterLink, NgIf, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'], // صححت typo
})
export class HomeComponent implements AfterViewInit, OnDestroy {

  @ViewChild('embla') emblaRef!: ElementRef;
  embla: any;
  selectedIndex = 0;
  autoplayInterval: any;
  showButton = false;
  isBrowser: boolean;

  formData = {
    name: '',
    email: '',
    phone: '',
    message: ''
  };

  resumes = [
    { image: 'assets/images/الغاء.png' },
    { image: 'assets/images/عقـــد-بيع-محل-تجارى.png' },
    { image: 'assets/images/عقد-تأسيس-شركة-اعمال-مدنية.png' },
    { image: 'assets/images/اتفاقية-وساطة-تجارية.png' },
    { image: 'assets/images/عقد-تعيين-وكيل-خدمات-محلي.png' },
    { image: 'assets/images/عقد-بيع-حصص-وفسخ-شراكة.png' },
    { image: 'assets/images/عقد-بيع حصص-وملحق-بتعديل-عقد-تأسيس.png' },
  ];

  constructor(private toastr: ToastrService, @Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  isFormValid(): boolean {
    return this.formData.name.trim() !== '' &&
      this.formData.email.trim() !== '' &&
      this.formData.phone.trim() !== '' &&
      this.formData.message.trim() !== '';
  }

  sendEmail(event: Event) {
    event.preventDefault();

    if (!this.isFormValid()) {
      alert('⚠️ من فضلك املا كل الخانات قبل الإرسال');
      return;
    }

    emailjs.send(
      'service_u05ciym',
      'template_gus4lip',
      this.formData,
      'w5YEfaytgTKkXuVTi'
    ).then(() => {
      this.toastr.success('تم إرسال رسالتك بنجاح ✅');
      this.formData = { name: '', email: '', phone: '', message: '' };
    }).catch(() => {
      this.toastr.error('حصل خطأ ما ❌');
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (!this.isBrowser) return;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.showButton = scrollY > 300;
  }

  scrollToTop() {
    if (!this.isBrowser) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  ngAfterViewInit() {
    if (!this.isBrowser) return;

    this.embla = EmblaCarousel(this.emblaRef.nativeElement, {
      direction: 'rtl',
      loop: true,
    });

    const updateSelected = () => {
      this.selectedIndex = this.embla.selectedScrollSnap();
      const slides = this.embla.slideNodes();
      slides.forEach((slide: HTMLElement, index: number) => {
        slide.classList.toggle('is-selected', index === this.selectedIndex);
      });
    };

    this.embla.on('select', updateSelected);
    updateSelected();

    this.autoplayInterval = setInterval(() => {
      if (!this.embla) return;
      if (!this.embla.canScrollNext()) {
        this.embla.scrollTo(0);
      } else {
        this.embla.scrollNext();
      }
    }, 7000);
  }

  ngOnDestroy() {
    clearInterval(this.autoplayInterval);
  }

  scrollPrev() {
    if (!this.isBrowser) return;
    this.embla.scrollPrev();
  }

  scrollNext() {
    if (!this.isBrowser) return;
    this.embla.scrollNext();
  }

  scrollTo(index: number) {
    if (!this.isBrowser) return;
    this.embla.scrollTo(index);
  }
}
