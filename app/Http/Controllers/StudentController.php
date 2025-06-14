<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Center;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Redirect;

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
        })->orderBy('created_at','desc')->get();

        return Inertia::render('Students/Index', [
            'students' => $students,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $centers = Center::select('center_id', 'center_name')
            ->orderBy('center_name')
            ->get();
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

        Student::create([
            'center_id'      => $validated['center_id'],
            'student_id'     => $validated['student_id'],
            'student_name'   => $validated['student_name'],
            'gender'         => $validated['gender'],
            'email'          => $validated['email'],
            'contact_number' => $validated['contact_number'],
            'date_of_birth'  => Carbon::parse($validated['date_of_birth'])->toDateString(),
            'enrolled_date'  => Carbon::parse($validated['enrolled_date'])->toDateString(),
            'status'         => $validated['status'],
            'parent_name'    => $validated['parent_name'],
        ]);

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
    public function edit(String $student_id)
    {
        $student = Student::where('student_id', $student_id)->firstOrFail();

        // Load centers for the dropdown
        $centers = Center::select('center_id', 'center_name')
            ->orderBy('center_name')
            ->get();

        return Inertia::render('Students/Edit', [
            'student' => $student,
            'centers' => $centers,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, String $student_id)
    {
        $student = Student::where('student_id', $student_id)->firstOrFail();

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

        $student->update([
            'center_id'      => $validated['center_id'],
            'student_name'   => $validated['student_name'],
            'gender'         => $validated['gender'],
            'email'          => $validated['email'],
            'contact_number' => $validated['contact_number'],
            'date_of_birth'  => Carbon::parse($validated['date_of_birth'])->toDateString(),
            'enrolled_date'  => Carbon::parse($validated['enrolled_date'])->toDateString(),
            'status'         => $validated['status'],
            'parent_name'    => $validated['parent_name'],
        ]);

        return redirect()->route('students.index')->with('success', 'Student updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $student = Student::where('student_id', $id)->firstOrFail();
        $student->delete();

        return Redirect::back()->with('success', 'Student deleted successfully!');
    }
}
