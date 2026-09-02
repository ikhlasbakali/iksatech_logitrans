<?php

namespace App\Http\Controllers;

use App\Models\Driver;
use App\Http\Requests\StoreDriverRequest;
use App\Http\Resources\DriverResource;
use Illuminate\Http\Request;

class DriverController extends Controller
{
    public function index()
    {
        return DriverResource::collection(Driver::with('user', 'currentVehicle')->get());
    }

    public function store(StoreDriverRequest $request)
    {
        $driver = Driver::create($request->validated());
        return new DriverResource($driver);
    }

    public function show(Driver $driver)
    {
        return new DriverResource($driver->load('user', 'currentVehicle'));
    }

    public function update(Request $request, Driver $driver)
    {
        $driver->update($request->all());
        return new DriverResource($driver);
    }

    public function destroy(Driver $driver)
    {
        $driver->delete();
        return response()->json(['message' => 'Chauffeur supprimé.']);
    }
}