<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Center;

class CenterController extends Controller
{
    public function set(Request $request)
    {
        $validIds = Center::pluck('center_id')->implode(',');

        $data = $request->validate([
            'center_id' => "required|string|in:all,{$validIds}",
        ]);

        if ($data['center_id'] === 'all') {
            session()->forget('selected_center_id');
        } else {
            session(['selected_center_id' => $data['center_id']]);
        }
        return redirect()->back();
    }
}
