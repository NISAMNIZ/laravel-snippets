const loginSnippets = [
  {
    tabLabel: 'Controller',
    language: 'php',
    badge: 'LoginController.php',
    code: `<?php

namespace App\\Http\\Controllers;

use App\\Mail\\RegisterMail;
use App\\Models\\User;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Auth;
use Illuminate\\Support\\Facades\\Mail;
use Illuminate\\Support\\Facades\\Validator;
use Illuminate\\Support\\Facades\\Password;
use Illuminate\\Support\\Facades\\Hash;
use Illuminate\\Support\\Str;
use Illuminate\\Auth\\Events\\PasswordReset;
use Log;

class LoginController extends Controller
{
    public function login(){
        return view('login');
    }

    public function register(){
        return view('register');
    }

    public function doRegister(Request $request){
        $rules=[
            'name' => 'required|unique:users',
            'email' => 'required|unique:users|email',
            'password' => 'required|min:8',
            'confirm-password' => 'required|same:password'
        ];

        $validator = Validator::make($request->all(),$rules);

        if($validator->fails()){
            return response()->json(['errors' => $validator->errors()],422);
        }

        $user = User::create([
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'password' => bcrypt($request->input('password'))
        ]);

        // try {
    Mail::to($user->email)->queue(new RegisterMail($user));
// } catch (\\Throwable $e) {
//     Log::warning('Mail Error', [
//         'message' => $e->getMessage(),
//     ]);
// }

        return response()->json(['status' => true]);
    }

    public function doLogin(Request $request){
        $rules=[
            'email' => 'required|email',
            'password' => 'required|min:8',
        ];

        $validator = Validator::make($request->all(),$rules);

        if($validator->fails()){
            return response()->json(['errors' => $validator->errors()],422);
        }

        $input = $request->only('email','password');

         $remember = $request->boolean('remember');

        if(auth()->guard('web')->attempt($input,$remember)){
            $request->session()->regenerate();
            return response()->json(['status' => true]);
        }else{
             return response()->json(['errors' => ['password' => ['Invalid Credentials']]],422);
        }
    }

    public function logout(Request $request){
        Auth::logout();
        $request->session()->invalidate();

    $request->session()->regenerateToken();
        return redirect()->route('user.login');
    }

    public function dashboard(){
    $user = Auth::user();
    return view('dashboard',compact('user'));
    }

    public function forgotPassword()
{
    return view('forgot-password');
}

public function sendResetLink(Request $request)
{
    $request->validate([
        'email' => 'required|email',
    ]);

    $status = Password::sendResetLink(
        $request->only('email')
    );

    return $status === Password::RESET_LINK_SENT
        ? back()->with('status', __($status))
        : back()->withErrors(['email' => __($status)]);
}

public function resetPassword(Request $request, string $token)
{
    return view('reset-password', [
        'token' => $token,
        'email' => $request->query('email'),
    ]);
}

public function updatePassword(Request $request)
{
    $request->validate([
        'token' => 'required',
        'email' => 'required|email',
        'password' => 'required|min:8|confirmed',
    ]);

    $status = Password::reset(
        $request->only(
            'email',
            'password',
            'password_confirmation',
            'token'
        ),
        function ($user, string $password) {
            $user->forceFill([
                'password' => Hash::make($password),
                'remember_token' => Str::random(60),
            ])->save();

            event(new PasswordReset($user));
        }
    );

    return $status === Password::PASSWORD_RESET
        ? redirect()->route('user.login')
            ->with('status', 'Password reset successfully. Please log in.')
        : back()->withErrors(['email' => __($status)]);
}

}`,
  },
  {
    tabLabel: 'Blade View',
    language: 'laravel',
    badge: 'login.blade.php',
    code: `@extends('template.app')

@section('title', 'Login')

@section('content')
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-5 col-lg-4">

                <div class="border rounded p-4">
                    <h3 class="text-center mb-4">Login Form</h3>

                    <form class="LoginForm">
                        @csrf

                        <div class="mb-3">
                            <label for="email" class="form-label">Email</label>
                            <input type="email" name="email" id="email"
                                placeholder="Enter your email" class="form-control">
                        </div>

                        <div class="mb-3">
                            <label for="password" class="form-label">Password</label>
                            <input type="password" name="password" id="password"
                                placeholder="Enter your password" class="form-control">
                        </div>

                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <div class="form-check">
                                <input type="checkbox" name="remember" id="remember"
                                    value="1" class="form-check-input">
                                <label for="remember" class="form-check-label">
                                    Remember Me
                                </label>
                            </div>

                            <a href="{{ route('password.request') }}"
                                class="small text-decoration-none">
                                Forgot Password?
                            </a>
                        </div>

                        <button type="button" class="btn btn-dark w-100 LoginButton">
                            Login
                        </button>

                        <p class="text-center mt-3 mb-0">
                            Don't have an account?
                            <a href="{{ route('user.register') }}">Register</a>
                        </p>
                    </form>
                </div>

            </div>
        </div>
    </div>

    <script>
        $('.LoginButton').click(function(e) {
            e.preventDefault();
            $('form-control').removeClass('is-invalid');
            $('.error-message').remove();
            $.post("{{ route('user.doLogin') }}", $('.LoginForm').serialize(), function() {
                toastr.success('Login Successful');
                setTimeout(function() {
                    window.location.href = "{{ route('user.dashboard') }}"
                })
            }).fail(function(response) {
                console.log(response.responseJSON);
                let errors = response.responseJSON.errors;
                $.each(errors, function(field, message) {
                    let inputField = $('#' + field);
                    inputField.addClass('is-invalid');
                    inputField.after('<span class="text-danger error-message">' + message[0] +
                        '<span>')
                })
            })
        });
    </script>
@endsection`,
  },
  {
    tabLabel: 'Routes',
    language: 'php',
    badge: 'web.php',
    code: `<?php

use App\\Http\\Controllers\\LoginController;
use Illuminate\\Support\\Facades\\Route;

Route::prefix('user')->group(function () {
    Route::get('login', [LoginController::class, 'login'])->name('user.login');
    Route::get('register', [LoginController::class, 'register'])->name('user.register');
    Route::post('doRegister', [LoginController::class, 'doRegister'])->name('user.doRegister');
    Route::post('doLogin', [LoginController::class, 'doLogin'])->name('user.doLogin');
    Route::get('forgot-password', [LoginController::class, 'forgotPassword',])->name('password.request');
    Route::post('forgot-password', [LoginController::class, 'sendResetLink',])->name('password.email');
    Route::get('reset-password/{token}', [LoginController::class, 'resetPassword',])->name('password.reset');
    Route::post('reset-password', [LoginController::class, 'updatePassword',])->name('password.update');

    Route::middleware('auth')->group(function () {
        Route::get('dashboard', [LoginController::class, 'dashboard'])->name('user.dashboard');
        Route::get('logout', [LoginController::class, 'logout'])->name('user.logout');
    });
});`,
  },
];

export default loginSnippets;
