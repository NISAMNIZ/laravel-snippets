const signupSnippets = [
  {
    tabLabel: 'Register Blade',
    language: 'laravel',
    badge: 'register.blade.php',
    code: `@extends('template.app')

@section('title', 'Register')

@section('content')
    <div class="container mt-5 mb-5">
        <div class="row justify-content-center">
            <div class="col-md-6 col-lg-5">

                <div class="border rounded p-4">
                    <h3 class="text-center mb-4">Register Form</h3>

                    <form class="RegisterForm">
                        @csrf

                        <div class="mb-3">
                            <label for="name" class="form-label">Name</label>
                            <input type="text" name="name" id="name"
                                placeholder="Enter your name" class="form-control">
                        </div>

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

                        <div class="mb-3">
                            <label for="confirm-password" class="form-label">
                                Confirm Password
                            </label>
                            <input type="password" name="confirm-password"
                                id="confirm-password"
                                placeholder="Confirm your password"
                                class="form-control">
                        </div>

                        <button type="button" class="btn btn-dark w-100 RegisterButton">
                            Register
                        </button>

                        <p class="text-center mt-3 mb-0">
                            Already have an account?
                            <a href="{{ route('user.login') }}">Login</a>
                        </p>
                    </form>
                </div>

            </div>
        </div>
    </div>

    <script>
        $('.RegisterButton').click(function(e){
            e.preventDefault();
            $('form-control').removeClass('is-invalid');
            $('.error-message').remove();
            $.post("{{route('user.doRegister')}}",$('.RegisterForm').serialize(),function(){
                toastr.success('Login Successful');
                setTimeout(function(){
                    window.location.href = "{{ route('user.login') }}"
                });
            }).fail(function(response){
                let errors = response.responseJSON.errors;
                $.each(errors,function(field,message){
                    let inputField = $('#' + field);
                    inputField.addClass('is-invalid');
                    inputField.after('<span class="text-danger error-message">' + message[0] + '<span>')
                })
            })
        });
    </script>
@endsection`,
  },
  {
    tabLabel: 'Controller',
    language: 'php',
    badge: 'LoginController.php — doRegister()',
    code: `// From LoginController.php — Registration method

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

    Mail::to($user->email)->queue(new RegisterMail($user));

    return response()->json(['status' => true]);
}`,
  },
];

export default signupSnippets;
