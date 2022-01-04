import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../service/data/user/user.service";
import {User} from "../../model/user";
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MustMatch} from "../../helpers/must-match.validator";
import {MessageService, PrimeNGConfig} from "primeng/api";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  providers: [MessageService]
})
export class ResetPasswordComponent implements OnInit {

  token!: string | null;
  user!: User;
  newPassword!: string;
  newPasswordControl!: string;
  editPasswordFrom!: FormGroup;
  submitted: boolean = false;
  passSubmitted: boolean = false;

  constructor(private route: ActivatedRoute,
              private userService: UserService,
              private router: Router,
              private formBuilder: FormBuilder,
              private config: PrimeNGConfig,
              private messageService: MessageService) {
  }

  ngOnInit(): void {

    this.route.paramMap.subscribe(param => {
      if (param.has('token')) {
        this.token = param.get('token');
      }
    })

    this.checkIfTokenIsValid(this.token);

    this.userService.findUserByToken(this.token).subscribe(response => {
      if (response != null) {
        console.log(response)
        this.user = response;
      }
    })


    this.editPasswordFrom = this.formBuilder.group(
      {
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

  get p(): { [key: string]: AbstractControl } {
    return this.editPasswordFrom.controls;
  }

  checkIfTokenIsValid(token: string | null) {
    let valid: Object;
    this.userService.checkIfTokenIsValid(token).subscribe(response => {
      valid = response;
      if (valid === false) {
        this.router.navigate(['/home']);
      }
    }, error => {
      this.router.navigate(['/home']);
    })
  }

  newPass(event: any) {
    const target = event.target as HTMLInputElement;
    this.newPassword = target.value;
  }

  newPass2(event: any) {
    const target = event.target as HTMLInputElement;
    this.newPasswordControl = target.value;
  }

  changePassword() {
    this.passSubmitted = true;
    this.user.password = this.newPassword;

    this.userService.changePassword(this.user.idUser, this.user).subscribe(data => {
      this.router.navigate(['/home']);
    })

    this.user.resetPasswordToken = null;
    this.userService.updateUser(this.user.idUser, this.user).subscribe(response => {

    })

  }


}
