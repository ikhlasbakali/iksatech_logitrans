<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class OperationController extends Controller
{
    public function index(Request $request)
    {
        return response()->json([
            'message' => 'Operations retrieved successfully.',
            'data' => []
        ]);
    }
}
