<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Subject;
use Inertia\Inertia;


class SubjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $subjects = Subject::orderBy('created_at', 'desc')->get();
        return Inertia::render('Subjects/Index', [
            'subjects' => $subjects,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'subject_name' => ['required', 'string', 'max:50'],
            'tuition_type' => ['required', 'string', 'max:50'],
            'fees'         => ['required', 'numeric', 'min:0'],
        ]);

        $subject = Subject::create($data);

        return response()->json(['subject' => $subject], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Subject $subject)
    {
        $data = $request->validate([
            'subject_name' => ['required', 'string', 'max:100'],
            'tuition_type' => ['required', 'string', 'max:50'],
            'fees'         => ['required', 'numeric', 'min:0'],
        ]);

        $subject->update($data);

        return response()->json([
            'subject' => $subject,
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Subject $subject)
    {
        $subject->delete();

        // No content needed on success
        return response()->json(null, 204);
    }
}
