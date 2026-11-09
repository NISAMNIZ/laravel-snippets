const commandsSnippets = [
  {
    tabLabel: 'Project Setup',
    language: 'php',
    badge: 'Terminal — New Project',
    code: `# Create a new Laravel project
composer create-project laravel/laravel project-name

# Navigate into project
cd project-name

# Generate application key
php artisan key:generate

# Start development server
php artisan serve`,
  },
  {
    tabLabel: 'Models & Migrations',
    language: 'php',
    badge: 'Terminal — make:model',
    code: `# Create model with migration
php artisan make:model Book -m
php artisan make:model Employee -m
php artisan make:model Department -m

# Create model with migration + controller + factory + seeder
php artisan make:model Product -mfcs

# Create model with all (migration, factory, seeder, policy, controller, form requests)
php artisan make:model Order --all

# Run migrations
php artisan migrate

# Rollback last migration
php artisan migrate:rollback

# Fresh migration (drop all tables & re-migrate)
php artisan migrate:fresh

# Fresh migration with seeders
php artisan migrate:fresh --seed`,
  },
  {
    tabLabel: 'Controllers',
    language: 'php',
    badge: 'Terminal — make:controller',
    code: `# Create a basic controller
php artisan make:controller LoginController

# Create a controller inside Api folder
php artisan make:controller Api/ApiAuthController
php artisan make:controller Api/BookController
php artisan make:controller Api/EmployeeController

# Create a resource controller (index, create, store, show, edit, update, destroy)
php artisan make:controller ProductController --resource

# Create an API resource controller (no create/edit)
php artisan make:controller Api/ProductController --api

# Create a controller with model binding
php artisan make:controller BookController --model=Book

# Create an invokable (single action) controller
php artisan make:controller CheckoutController --invokable`,
  },
  {
    tabLabel: 'Auth & Mail',
    language: 'php',
    badge: 'Terminal — Auth & Mail',
    code: `# Install Sanctum API authentication
php artisan install:api

# Create a Mailable class
php artisan make:mail RegisterMail
php artisan make:mail WelcomeMail
php artisan make:mail OrderConfirmationMail

# Create a Form Request for validation
php artisan make:request LoginRequest
php artisan make:request StoreBookRequest

# Create middleware
php artisan make:middleware EnsureUserIsAdmin

# Create an API Resource
php artisan make:resource EmployeeResource
php artisan make:resource BookResource

# Create a Resource Collection
php artisan make:resource BookCollection --collection`,
  },
  {
    tabLabel: 'Database',
    language: 'php',
    badge: 'Terminal — Database',
    code: `# Create a seeder
php artisan make:seeder UserSeeder
php artisan make:seeder BookSeeder

# Run seeders
php artisan db:seed
php artisan db:seed --class=UserSeeder

# Create a factory
php artisan make:factory BookFactory
php artisan make:factory EmployeeFactory

# Create a migration manually
php artisan make:migration create_books_table
php artisan make:migration add_role_to_users_table
php artisan make:migration add_department_id_to_employees_table`,
  },
  {
    tabLabel: 'Useful Commands',
    language: 'php',
    badge: 'Terminal — Utilities',
    code: `# Clear all caches
php artisan optimize:clear

# Cache for production
php artisan optimize

# List all routes
php artisan route:list

# List routes filtered by name
php artisan route:list --name=book

# List routes filtered by path
php artisan route:list --path=api

# Create a queue job
php artisan make:job SendEmailJob

# Create an event & listener
php artisan make:event UserRegistered
php artisan make:listener SendWelcomeEmail

# Create a notification
php artisan make:notification InvoicePaid

# Create a policy
php artisan make:policy BookPolicy --model=Book

# Run queue worker
php artisan queue:work

# Create storage symlink
php artisan storage:link

# Tinker (interactive shell)
php artisan tinker`,
  },
];

export default commandsSnippets;
