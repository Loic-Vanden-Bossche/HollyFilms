import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ThemesService } from '../../shared/services/themes.service';
import { NotificationsService } from '../../shared/services/notifications.service';
import { NotificationType } from '../../shared/models/notification.model';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
})
export class SignInComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({});

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private themes: ThemesService,
    private notifications: NotificationsService
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  get imgColor() {
    return this.themes.currentTheme === 'dark' ? 'white' : 'black';
  }

  onSubmit() {
    if (this.loginForm && this.loginForm.valid) {
      this.auth
        .authenticate(
          this.loginForm.controls['email'].value,
          this.loginForm.controls['password'].value
        )
        .subscribe({
          next: () => {
            this.notifications.push({
              type: NotificationType.Success,
              message: 'Connexion réussie',
              lifetime: 3000,
            });
            const returnUrl = this.route.snapshot.queryParams['returnUrl'];
            if (returnUrl) {
              const url = this.router.parseUrl(returnUrl);
              this.router.navigate(
                ['/' + url.root.children['primary'].segments.join('/') + '/'],
                { queryParams: url.queryParams }
              );
            } else if (this.auth.isActivated) {
              this.router.navigate(['home']);
            } else {
              this.router.navigate(['']);
            }
          },
          error: (err) => {
            switch (err.status) {
              case 401:
                this.notifications.push({
                  type: NotificationType.Error,
                  message: 'Email ou mot de passe incorrect',
                  lifetime: 3000,
                });
                break;

              case 400:
                this.notifications.push({
                  type: NotificationType.Warning,
                  message: "Connectez vous à l'aide de Google",
                  lifetime: 3000,
                });
                break;

              default:
                this.notifications.push({
                  type: NotificationType.Error,
                  message:
                    'Une erreur inconnue est survenue, réessayez plus tard',
                  lifetime: 3000,
                });
                break;
            }
          },
        });
    } else {
      this.notifications.push({
        type: NotificationType.Error,
        message: 'Erreur, vérifiez vos informations.',
        lifetime: 3000,
      });
    }
  }
}
