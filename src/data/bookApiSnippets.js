const bookApiSnippets = [
  {
    tabLabel: 'Controller',
    language: 'php',
    badge: 'BookController.php',
    code: `<?php

namespace App\\Http\\Controllers\\Api;

use App\\Http\\Controllers\\Controller;
use App\\Models\\Book;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Validator;
use Illuminate\\Validation\\Rule;

class BookController extends Controller
{
    public function createBook(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'isbn' => 'required|string|unique:books,isbn',
            'published_year' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $book = Book::create($validator->validated());

        return response()->json([
            'message' => 'Book created successfully',
            'data' => $book,
        ], 201);
    }

    public function listBooks()
    {
        $books = Book::all();

        return response()->json([
            'data' => $books,
        ], 200);
    }

    public function viewBook($id)
    {
        $book = Book::find($id);

        if (! $book) {
            return response()->json([
                'message' => 'Book not found',
            ], 404);
        }

        return response()->json([
            'data' => $book,
        ], 200);
    }

    public function updateBook(Request $request, $id)
    {
        $book = Book::find($id);

        if (! $book) {
            return response()->json([
                'message' => 'Book not found',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'author' => 'sometimes|required|string|max:255',
            'isbn' => [
                'sometimes',
                'required',
                'string',
                Rule::unique('books', 'isbn')->ignore($book->id),
            ],
            'published_year' => 'sometimes|nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $book->update($validator->validated());

        return response()->json([
            'message' => 'Book updated successfully',
            'data' => $book->fresh(),
        ], 200);
    }

    public function deleteBook($id)
    {
        $book = Book::find($id);

        if (! $book) {
            return response()->json([
                'message' => 'Book not found',
            ], 404);
        }

        $book->delete();

        return response()->json([
            'message' => 'Book deleted successfully',
        ], 200);
    }
}`,
  },
  {
    tabLabel: 'Routes',
    language: 'php',
    badge: 'routes/api.php — Books (Protected)',
    code: `<?php

use App\\Http\\Controllers\\Api\\BookController;
use Illuminate\\Support\\Facades\\Route;

// Protected — Requires Sanctum Token
Route::middleware('auth:sanctum')->group(function () {

    Route::post('createBook', [BookController::class, 'createBook'])
        ->name('book.create');

    Route::get('listBooks', [BookController::class, 'listBooks'])
        ->name('book.list');

    Route::get('viewBook/{id}', [BookController::class, 'viewBook'])
        ->name('book.viewBook');

    Route::post('updateBook/{id}', [BookController::class, 'updateBook'])
        ->name('book.updateBook');

    Route::post('deleteBook/{id}', [BookController::class, 'deleteBook'])
        ->name('book.deleteBook');

});`,
  },
  {
    tabLabel: 'Model',
    language: 'php',
    badge: 'Book.php',
    code: `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;

class Book extends Model
{
    protected $guarded = [];
}

// ──────────────────────────────────────────────
// Migration: php artisan make:model Book -m
// ──────────────────────────────────────────────
// Schema::create('books', function (Blueprint $table) {
//     $table->id();
//     $table->string('title');
//     $table->string('author');
//     $table->string('isbn')->unique();
//     $table->integer('published_year')->nullable();
//     $table->timestamps();
// });`,
  },
];

export default bookApiSnippets;
