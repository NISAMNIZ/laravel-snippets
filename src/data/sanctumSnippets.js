const sanctumSnippets = [
  {
    tabLabel: 'Setup & Install',
    language: 'php',
    badge: 'Terminal',
    code: `# Install Sanctum (Laravel 11+)
php artisan install:api

# This command will:
# 1. Install Laravel Sanctum
# 2. Publish the Sanctum config file
# 3. Create the personal_access_tokens migration
# 4. Add the api.php route file
# 5. Register the API route in bootstrap/app.php

# Run migrations
php artisan migrate

# ──────────────────────────────────────────────
# Make sure your User model uses HasApiTokens
# ──────────────────────────────────────────────
# app/Models/User.php
#
# use Laravel\\Sanctum\\HasApiTokens;
#
# class User extends Authenticatable
# {
#     use HasApiTokens, HasFactory, Notifiable;
#     ...
# }`,
  },
  {
    tabLabel: 'Auth Controller',
    language: 'php',
    badge: 'ApiAuthController.php',
    code: `<?php

namespace App\\Http\\Controllers\\Api;

use App\\Http\\Controllers\\Controller;
use App\\Models\\User;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Hash;
use Illuminate\\Validation\\ValidationException;

class ApiAuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
            'device_name' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Invalid email or password'],
            ]);
        }

        $token = $user->createToken($request->device_name)->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'token' => $token,
            'user' => $user,
        ], 200);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout successful',
        ]);
    }
}`,
  },
  {
    tabLabel: 'API Routes',
    language: 'php',
    badge: 'routes/api.php — Auth',
    code: `<?php

use App\\Http\\Controllers\\Api\\ApiAuthController;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Route;

// Public — Login (no token needed)
Route::post('login', [ApiAuthController::class, 'login']);

// Protected — Requires Sanctum Token
Route::middleware('auth:sanctum')->group(function () {

    // Logout
    Route::post('/logout', [ApiAuthController::class, 'logout']);

    // Get authenticated user
    Route::get('/user', function (Request $request) {
        return response()->json([
            'user' => $request->user(),
        ]);
    });

    // ... Book routes (protected) go here
});`,
  },
];

export default sanctumSnippets;
