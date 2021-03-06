import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ɵɵsetComponentScope,
} from '@angular/core'
import { AbstractControl, ControlContainer, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { ToastrService } from 'ngx-toastr'
import { AccountService } from '../_services/account.service'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter()
  registerForm: FormGroup
  maxDate: Date
  validationErrors: string[] = []
  genderList = [
    { value: 'male', display: 'Male' },
    { value: 'female', display: 'Female' },
    { value: '', display: 'Expansive' },
  ]
  orientationList = [
    { value: 'straight', display: 'Straight' },
    { value: 'bisexual', display: 'Bisexual' },
    { value: 'gay', display: 'Gay' },
    { value: '', display: 'Expansive' }
  ]
  relationshipStatusList = [
    { value: 'single', display: 'Single' },
    { value: 'dating', display: 'Dating' },
    { value: 'open', display: 'Open' },
    { value: 'poly', display: 'Polyamorous' },
    { value: 'complicated', display: "It's complicated" },
    { value: 'married', display: "Married" },
  ]
  pronounsList = [
    { value: 'he/him', display: 'He/Him' },
    { value: 'she/her', display: 'She/Her' },
    { value: 'they/them', display: 'They/Them' },
    { value: '', display: 'Expansive' }
  ]

  constructor(
    private accountService: AccountService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm()
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18)
  }

  initializeForm() {
    this.registerForm = this.fb.group({      
      username: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      gender: ['male', Validators.required],
      orientation: ['straight', Validators.required],
      pronouns: ['he/him', Validators.required],
      relationshipStatus: ['single', Validators.required],
      alias: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
      confirmPassword: ['', [Validators.required, this.matchValues('password'), Validators.minLength(4), Validators.maxLength(20)]],
    })

    // Check password field for changes and make confirmPassword field aware of change
    // just in case someone changes the password field after confirming password match
    this.registerForm.controls.password.valueChanges.subscribe(() => {
      this.registerForm.controls.confirmPassword.updateValueAndValidity()
    })
  }

  
  /**
   * Compare confirm password control with password you want to match to
   * if passwords match return null meaning validation passed else return isMatching true
   * 
   * @param {string} matchTo
   * @return {*}  {ValidatorFn}
   */
  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control?.value === control?.parent?.controls[matchTo].value ? null : { isMatching: true }
    }
  }

  /**
   * Registers a new user using the AccountService
   *
   */
  register() {
    this.accountService.register(this.registerForm.value).subscribe(
      response => {
        this.router.navigateByUrl('/members')
      },
      error => {
        this.validationErrors = error.error.errors
      },
    )
  }

  /**
   * Emits a registration cancelation when cancel button is clicked
   *
   */
  cancel() {
    this.cancelRegister.emit(false)
  }
}
