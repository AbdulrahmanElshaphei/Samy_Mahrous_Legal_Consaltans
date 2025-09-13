import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./shared/layout/navbar/navbar.component";
import { FooterComponent } from "./shared/layout/footer/footer.component";
import { FloatingButtonsComponent } from './shared/floating-buttons/floating-buttons.component';

declare var gtag: Function; // مهم جدًا عشان يتعرف على gtag

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, FloatingButtonsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Samy Mahrous';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        gtag('config', 'AW-17542736996', {
          page_path: event.urlAfterRedirects,
        });
      }
    });
  }
}
