import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: []
})
export class ProfileComponent implements OnInit {
  public user:any;
 
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!this.user || !this.user.name) {
      this.router.navigate(['/login']);
    }
  }
}
