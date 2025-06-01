<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Center;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $centerId = session('selected_center_id');
        $students = Student::when($centerId, function ($query) use ($centerId) {
            return $query->where('center_id', $centerId);
        })->get();

        return Inertia::render('Students/Index', [
            'students' => $students,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $centers = Center::all();
        return Inertia::render('Students/Create', [
            'centers' => $centers,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|string|max:255',
            'student_name' => 'required|string|max:255',
            'gender' => 'required|in:male,female',
            'email' => 'required|email|',
            'enrolled_date' => 'required|date|after_or_equal:date_of_birth',
            'status' => 'required|string',
            'contact_number' => 'required|string|max:15',
            'date_of_birth' => 'required|date|before:today',
            'center_id' => 'required',
            'parent_name' => 'required|string|max:255',
        ]);

        Student::create($validated);

        return redirect()->route('students.index')->with('success', 'Student added successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Student $student)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Student $student)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Student $student)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Student $student)
    {
        //
    }
}
