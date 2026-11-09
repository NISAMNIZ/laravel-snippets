const employeeApiSnippets = [
  {
    tabLabel: 'Controller',
    language: 'php',
    badge: 'EmployeeController.php',
    code: `<?php

namespace App\\Http\\Controllers\\Api;

use App\\Http\\Controllers\\Controller;
use App\\Http\\Resources\\EmployeeResource;
use App\\Models\\Department;
use App\\Models\\Employee;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Validator;
use Illuminate\\Support\\Str;
use Illuminate\\Validation\\Rule;

class EmployeeController extends Controller
{
    public function createDepartment(Request $request)
    {
        $rules = [
            'name' => 'required|unique:departments',
            'description' => 'sometimes',
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $data = $validator->validated();
        $data['slug'] = Str::slug($data['name'], '_');

        $department = Department::create($data);

        return response()->json(['message' => 'Department Created Successfully', 'data' => $department->makeHidden('slug')], 201);

    }

    public function listDepartment()
    {
        $department = Department::get();
        if ($department->isEmpty()) {
            return response()->json(['message' => 'Department No Found'], 422);
        }

        return response()->json(['data' => $department->makeHidden('slug')]);
    }

    public function viewDepartment(Request $request, $id)
    {
        $department = Department::find($id);
        if (!$department) {
            return response()->json(['message' => 'Department No Found'], 422);
        }

        return response()->json(['data' => $department->makeHidden('slug')]);

    }

    public function updateDepartment(Request $request, $id){
        $department = Department::find($id);
        if (!$department) {
            return response()->json(['message' => 'Department No Found'], 422);
        }

        $rules = [
            'name' => 'sometimes',
            Rule::unique('departments', 'name')->ignore($department->id),
            'description' => 'sometimes',
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $department->update($validator->validated());

         return response()->json(['message' => 'Department Updated Successfully', 'data' => $department->makeHidden('slug')], 201);


    }

    public function deleteDepartment(Request $request, $id)
    {
        $department = Department::find($id);
        if (!$department) {
            return response()->json(['message' => 'Department No Found'], 422);
        }

        $depCount = $department->employee()->count();
        if($depCount >= 1){
            return response()->json(['message' => 'Cannot delete department which already has employees'], 422);
        }

        $department->delete();
        return response()->json(['message' => 'Department Deleted Successfully'], 422);

    }

    public function createEmployee(Request $request)
    {
        $rules = [
            'name' => 'required',
            'email' => 'required|email|unique:employees',
            'department' => 'required',
            'position' => 'required|string',
            'salary' => 'required|numeric',
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $data = $validator->validated();

        $department = Department::where('slug',$request->department)->first();

        if (!$department) {
            return response()->json(['message' => 'Department No Found'], 422);
        }
        unset($data['department']);

        $data['department_id'] = $department->id;

        $employee = Employee::create($data);

        return response()->json(['message' => 'Employee Created Successfully', 'data' => new EmployeeResource($employee->load('department'))], 201);

    }

    public function listEmployees()
    {
        $employees = Employee::get();
        if ($employees->isEmpty()) {
        return response()->json(['message' => 'Employees Not Found'], 404);
    }

    return response()->json([
        'data' => EmployeeResource::collection($employees),
    ]);
    }


    public function viewEmployee(Request $request, $id)
    {
        $employee = Employee::find($id);
        if (!$employee) {
            return response()->json(['message' => 'Department No Found'], 422);
        }

        return response()->json(['data' => new EmployeeResource($employee)]);

    }


    public function updateEmployee(Request $request, $id){
        $employee = Employee::find($id);
        if (!$employee) {
            return response()->json(['message' => 'Employee No Found'], 422);
        }

        $rules = [
            'name' => 'sometimes',
            'email' => 'sometimes|email', Rule::unique('employees', 'email')->ignore($employee->id),
            'department' => 'sometimes',
            'position' => 'sometimes|string',
            'salary' => 'sometimes|numeric',
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $data = $validator->validated();

        if (isset($data['department'])) {
        $data['department_id'] = Department::where('slug', $data['department'])->value('id');
        unset($data['department']);
    }

        $employee->update($data);

         return response()->json(['message' => 'Employee Updated Successfully', 'data' => new EmployeeResource($employee->load('department'))], 201);


    }


    public function deleteEmployee(Request $request, $id)
    {
        $employee = Employee::find($id);
        if (!$employee) {
            return response()->json(['message' => 'Employee No Found'], 404);
        }

        $employee->delete();
        return response()->json(['message' => 'Employee Deleted Successfully'], 422);

    }
}`,
  },
  {
    tabLabel: 'Routes',
    language: 'php',
    badge: 'routes/api.php — Employee (Public)',
    code: `<?php

use App\\Http\\Controllers\\Api\\EmployeeController;
use Illuminate\\Support\\Facades\\Route;

// Public — No authentication required

// Department CRUD
Route::post('createDepartment', [EmployeeController::class, 'createDepartment'])
    ->name('employee.createDepartment');
Route::get('listDepartment', [EmployeeController::class, 'listDepartment'])
    ->name('employee.listDepartment');
Route::get('viewDepartment/{id}', [EmployeeController::class, 'viewDepartment'])
    ->name('employee.viewDepartment');
Route::post('updateDepartment/{id}', [EmployeeController::class, 'updateDepartment'])
    ->name('employee.updateDepartment');
Route::post('deleteDepartment/{id}', [EmployeeController::class, 'deleteDepartment'])
    ->name('employee.deleteDepartment');

// Employee CRUD
Route::post('createEmployee', [EmployeeController::class, 'createEmployee'])
    ->name('employee.createEmployee');
Route::get('listEmployees', [EmployeeController::class, 'listEmployees'])
    ->name('employee.listEmployees');
Route::get('viewEmployee/{id}', [EmployeeController::class, 'viewEmployee'])
    ->name('employee.viewEmployee');
Route::post('updateEmployee/{id}', [EmployeeController::class, 'updateEmployee'])
    ->name('employee.updateEmployee');
Route::post('deleteEmployee/{id}', [EmployeeController::class, 'deleteEmployee'])
    ->name('employee.deleteEmployee');`,
  },
  {
    tabLabel: 'Models',
    language: 'php',
    badge: 'Department.php & Employee.php',
    code: `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;

class Department extends Model
{
    protected $guarded = [];

    public function employees()
    {
        return $this->hasMany(Employee::class);
    }
}


// ──────────────────────────────────────────────


<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;

class Employee extends Model
{
    protected $guarded = [];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }
}`,
  },
  {
    tabLabel: 'Resource',
    language: 'php',
    badge: 'EmployeeResource.php',
    code: `<?php

namespace App\\Http\\Resources;

use Illuminate\\Http\\Request;
use Illuminate\\Http\\Resources\\Json\\JsonResource;

class EmployeeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'name'       => $this->name,
            'email'      => $this->email,
            'position'   => $this->position,
            'salary'     => $this->salary,
            'department' => $this->whenLoaded('department', function () {
                return [
                    'id'   => $this->department->id,
                    'name' => $this->department->name,
                ];
            }),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}`,
  },
  {
    tabLabel: 'Full api.php',
    language: 'php',
    badge: 'routes/api.php — Complete',
    code: `<?php

use App\\Http\\Controllers\\Api\\ApiAuthController;
use App\\Http\\Controllers\\Api\\BookController;
use App\\Http\\Controllers\\Api\\EmployeeController;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Route;


// ──────────────────────────────────────────────
// Public — No authentication needed
// ──────────────────────────────────────────────

Route::post('login', [ApiAuthController::class, 'login']);

// Department CRUD (public)
Route::post('createDepartment',[EmployeeController::class,'createDepartment'])->name('employee.createDepartment');
Route::get('listDepartment',[EmployeeController::class,'listDepartment'])->name('employee.listDepartment');
Route::get('viewDepartment/{id}',[EmployeeController::class,'viewDepartment'])->name('employee.viewDepartment');
Route::post('updateDepartment/{id}',[EmployeeController::class,'updateDepartment'])->name('employee.updateDepartment');
Route::post('deleteDepartment/{id}',[EmployeeController::class,'deleteDepartment'])->name('employee.deleteDepartment');

// Employee CRUD (public)
Route::post('createEmployee',[EmployeeController::class,'createEmployee'])->name('employee.createEmployee');
Route::get('listEmployees',[EmployeeController::class,'listEmployees'])->name('employee.listEmployees');
Route::get('viewEmployee/{id}',[EmployeeController::class,'viewEmployee'])->name('employee.viewEmployee');
Route::post('updateEmployee/{id}',[EmployeeController::class,'updateEmployee'])->name('employee.updateEmployee');
Route::post('deleteEmployee/{id}',[EmployeeController::class,'deleteEmployee'])->name('employee.deleteEmployee');


// ──────────────────────────────────────────────
// Protected — Requires Sanctum Token
// ──────────────────────────────────────────────

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [ApiAuthController::class, 'logout']);

    Route::get('/user', function (Request $request) {
        return response()->json([
            'user' => $request->user(),
        ]);
    });

    // Book CRUD (protected)
    Route::post('createBook',[BookController::class,'createBook'])->name('book.create');
    Route::get('listBooks',[BookController::class,'listBooks'])->name('book.list');
    Route::get('viewBook/{id}',[BookController::class,'viewBook'])->name('book.viewBook');
    Route::post('updateBook/{id}',[BookController::class,'updateBook'])->name('book.updateBook');
    Route::post('deleteBook/{id}',[BookController::class,'deleteBook'])->name('book.deleteBook');
});`,
  },
];

export default employeeApiSnippets;
