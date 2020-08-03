import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../../_services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.initForms();
  }

  onLogin() {
    let username = this.loginForm.value['username'];
    let password = this.loginForm.value['password'];

    if (username.length == 0 || password.length == 0) {
      alert('Please fill in all fields!');
      return;
    }

    this.authService.login(username, password);
  }

  initForms() {
    let username = '';
    let password = '';

    this.loginForm = new FormGroup({
      'username': new FormControl(username, Validators.required),
      'password': new FormControl(password, Validators.required)
    });
  }

}
