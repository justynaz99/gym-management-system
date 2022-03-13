import {Component, OnInit} from '@angular/core';
import {User} from "../../model/user";
import {UserAuthService} from "../../service/data/user-auth/user-auth.service";
import {Router} from "@angular/router";
import {Message, MessageService, PrimeNGConfig} from "primeng/api";
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MustMatch} from "../../helpers/must-match.validator";

@Component({
  selector: 'app-registration',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user: User = new User();
  usernameTaken: boolean = false;
  registerForm!: FormGroup;
  submitted: boolean = false;

  constructor(private userAuthService: UserAuthService,
              private router: Router,
              private formBuilder: FormBuilder,
              private config: PrimeNGConfig) {
  }

  ngOnInit() {

    if (this.userAuthService.currentUserValue) {
      this.router.navigate(['/profile']);
      return;
    }


    this.registerForm = this.formBuilder.group(
      {
        firstName: ['',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20)
          ]
        ],
        lastName: ['',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20)
          ]
        ],
        username: ['',
          [
            Validators.required,
            Validators.email
          ]
        ],
        birthDate: ['', Validators.required],
        phoneNumber: ['', Validators.required],
        password: ['',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(40),
            Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)
          ]
        ],
        confirmPassword: ['', Validators.required],
      },
      {
        validator: MustMatch('password', 'confirmPassword')
      }

    );

  }

  get f(): { [key: string]: AbstractControl } {
    return this.registerForm.controls;
  }

  /**
   * if entered values are valid adds user to database
   */
  onSubmit() {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    } else {
      this.userAuthService.register(this.user).subscribe(data => {
        this.router.navigate(['/login']);
      }, err => {
        this.usernameTaken = true;
      });
    }
  }


}

