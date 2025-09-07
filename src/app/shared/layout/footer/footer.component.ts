import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
openFacebook() {
  window.open('https://www.facebook.com/lawexperts.ae?locale=ar_AR', '_blank');
}

openInstagram() {
  window.open('https://www.instagram.com/samy_mashaal/', '_blank');
}

openTiktok() {
  window.open('https://www.tiktok.com/@samy_mashal?lang=en', '_blank');
}
}
