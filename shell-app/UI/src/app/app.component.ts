// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'shell';
  public userName: string = '';
  private queryParamSubscription: Subscription | undefined;


  constructor(private router: Router, private route: ActivatedRoute) {
    this.router = router;
  }

  ngOnInit(): void {
    this.queryParamSubscription = this.route.queryParamMap.subscribe(params => {
      const paramValue = params.get('login');
      if (paramValue === '1') {
        console.log('Login successful, fetching user info from localStorage');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        this.userName = user ? user?.name : '';
      }
    });
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userName = user ? user?.name : '';
  }

  public signOut(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.userName = '';
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    if (this.queryParamSubscription) {
      this.queryParamSubscription.unsubscribe();
    }
  }
}
