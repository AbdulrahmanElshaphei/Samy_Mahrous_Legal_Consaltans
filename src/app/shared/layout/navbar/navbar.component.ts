import { Component, HostListener, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, Event as RouterEvent, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnDestroy {
  isLoggedIn = false;
  navbarScrolled = false;
  isAuthPage = false;

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private userSub!: Subscription;
  private routerSub!: Subscription;

  constructor() {
    // متابعة حالة تسجيل الدخول
    this.userSub = this.authService.userData.subscribe(res => {
      this.isLoggedIn = !!res;
    });

    // رصد تغييرات الراوتر لمعرفة إذا كانت الصفحة login أو register
    this.routerSub = this.router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects;
        this.isAuthPage = url === '/login' || url === '/register';
      }
    });
  }

  /** تسجيل الخروج */
  logOut(): void {
    this.authService.signout();
  }

  /** يراقب وضع التمرير */
  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (typeof window !== 'undefined') {
      this.navbarScrolled = window.pageYOffset > 60;
    }
  }

  /** تنظيف الاشتراكات */
  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
    this.routerSub?.unsubscribe();
  }
}
