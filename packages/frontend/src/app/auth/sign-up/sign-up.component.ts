import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ThemesService } from '../../shared/services/themes.service';
import { NotificationsService } from '../../shared/services/notifications.service';
import { NotificationType } from '../../shared/models/notification.model';

export function mustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
      return;
    }

    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null);
    }
  };
}

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
})
export class SignUpComponent {
  registerForm: FormGroup = new FormGroup({});
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private themes: ThemesService,
    private notifications: NotificationsService,
  ) {}

  get f() {
    return this.registerForm.controls;
  }

  ngOnInit() {
    this.registerForm = this.fb.group(
      {
        email: [
          '',
          Validators.compose([Validators.required, Validators.email]),
        ],
        password: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(20),
          ]),
        ],
        confirmPassword: ['', Validators.compose([Validators.required])],
        firstname: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(20),
          ]),
        ],
        lastname: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(20),
          ]),
        ],
        username: [
          '',
          Validators.compose([
            Validators.minLength(2),
            Validators.maxLength(20),
          ]),
        ],
      },
      {
        validator: mustMatch('password', 'confirmPassword'),
      },
    );
  }

  fieldErrors(field: string) {
    return this.getFieldErrors(field, (error) => {
      switch (error) {
        case 'required':
          return 'Champ requis';
        case 'email':
          return 'Adresse email non valide';
        case 'mustMatch':
          return 'Les mots de passes doivent êtres identiques';
        case 'minlength':
          return `${
            (this.f[field].errors as ValidationErrors)['minlength'][
              'requiredLength'
            ]
          } minimum`;
        case 'maxlength':
          return `${
            (this.f[field].errors as ValidationErrors)['maxlength'][
              'requiredLength'
            ]
          } maximum`;
        default:
          return '';
      }
    });
  }

  isError(field: string) {
    return !!this.f[field].errors && (this.f[field].touched || this.submitted);
  }

  getFieldErrors(field: string, map: (error: string) => string) {
    return Object.keys(this.f[field].errors || {})
      .map(map)
      .filter((error) => !!error)
      .join(', ');
  }

  get imgColor() {
    return this.themes.currentTheme === 'dark' ? 'white' : 'black';
  }

  onSubmit() {
    this.submitted = true;
    if (this.registerForm && this.registerForm.valid) {
      const data = {
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        firstname: this.registerForm.value.firstname,
        lastname: this.registerForm.value.lastname,
        username: this.registerForm.value.username,
      };

      this.auth.register(data).subscribe({
        next: () => {
          this.notifications.push({
            type: NotificationType.Success,
            message: 'Compte créé avec succès',
            lifetime: 3000,
          });
          this.router.navigate(['']);
        },
        error: (err) => {
          if (err.status === 403) {
            this.notifications.push({
              type: NotificationType.Error,
              message: 'Email déjà utilisé',
              buttons: [
                {
                  label: 'Se connecter',
                  action: () => {
                    this.router.navigate(['/sign-in']);
                  },
                },
              ],
              lifetime: 3000,
            });
          } else {
            this.notifications.push({
              type: NotificationType.Error,
              message: 'Une erreur inconnue est survenue, réessayez plus tard',
              lifetime: 3000,
            });
          }
        },
      });
    }
  }
}
