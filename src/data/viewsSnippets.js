const viewsSnippets = [
  {
    tabLabel: 'App Layout',
    language: 'laravel',
    badge: 'template/app.blade.php',
    code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>@yield('title')</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/4.0.0/jquery.js" integrity="sha512-jx7pKV1OCCwD8nJVKETycdimr+xPg3VCP0Wc5tX0RdpusPKEC72eB5cyqgT48K5HxbXvbxIc/oDVb70QMhSeLw==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.css" integrity="sha512-3pIirOrwegjM6erE5gPSwkUzO+3cTjpnV9lexlNZqvupR64iZBnOOTiiLPb9M36zpMScbmUNIcHUqKD47M719g==" crossorigin="anonymous" referrerpolicy="no-referrer">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js" integrity="sha512-VEd+nq25CkR676O+pLBnDW09R7VQX9Mdiij052gVCp5yVH3jGtH70Ho/UUv4mJDsEdTvqRCFZg0NKGiojGnUCw==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
</head>
<body>
@yield('content')
</body>
</html>`,
  },
  {
    tabLabel: 'Forgot Password',
    language: 'laravel',
    badge: 'forgot-password.blade.php',
    code: `@extends('template.app')

@section('title', 'Forgot Password')

@section('content')
<div class="container mt-5">
    <h2>Forgot Password</h2>

    @if (session('status'))
        <div class="alert alert-success">
            {{ session('status') }}
        </div>
    @endif

    @if ($errors->any())
        <div class="alert alert-danger">
            {{ $errors->first() }}
        </div>
    @endif

    <form method="POST" action="{{ route('password.email') }}">
        @csrf

        <div class="mb-3">
            <label>Email</label>
            <input
                type="email"
                name="email"
                class="form-control"
                value="{{ old('email') }}"
                required
            >
        </div>

        <button type="submit" class="btn btn-dark">
            Send Reset Link
        </button>
    </form>
</div>
@endsection`,
  },
  {
    tabLabel: 'Reset Password',
    language: 'laravel',
    badge: 'reset-password.blade.php',
    code: `@extends('template.app')

@section('title', 'Reset Password')

@section('content')
<div class="container mt-5">
    <h2>Reset Password</h2>

    @if ($errors->any())
        <div class="alert alert-danger">
            {{ $errors->first() }}
        </div>
    @endif

    <form method="POST" action="{{ route('password.update') }}">
        @csrf

        <input type="hidden" name="token" value="{{ $token }}">

        <div class="mb-3">
            <label>Email</label>
            <input
                type="email"
                name="email"
                class="form-control"
                value="{{ old('email', $email) }}"
                required
            >
        </div>

        <div class="mb-3">
            <label>New Password</label>
            <input
                type="password"
                name="password"
                class="form-control"
                required
            >
        </div>

        <div class="mb-3">
            <label>Confirm New Password</label>
            <input
                type="password"
                name="password_confirmation"
                class="form-control"
                required
            >
        </div>

        <button type="submit" class="btn btn-dark">
            Reset Password
        </button>
    </form>
</div>
@endsection`,
  },
];

export default viewsSnippets;
