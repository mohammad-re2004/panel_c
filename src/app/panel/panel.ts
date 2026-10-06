import { Component, OnInit, signal } from '@angular/core';
import { Auth } from '../services/auth';
import { User } from '../interfaces/user_interface';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-panel',
  imports: [RouterLink,RouterOutlet],
  templateUrl: './panel.html',
  styleUrl: './panel.css',
})
export class Panel implements OnInit {
  user = signal<User | null>(null);

  constructor(private authService: Auth) { }

  ngOnInit(): void {
    this.authService.getUser().subscribe({
      next: (user) => this.user.set(user),

    });
  }
}