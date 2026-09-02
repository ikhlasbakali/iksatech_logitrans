<?php

namespace App\Http\Controllers;

use App\Models\Vehicle;
use App\Http\Requests\StoreVehicleRequest;
use App\Http\Resources\VehicleResource;
use Illuminate\Http\Request;

class VehicleController extends Controller
{
    public function index()
    {
        return VehicleResource::collection(Vehicle::with('currentDriver')->get());
    }

    public function store(StoreVehicleRequest $request)
    {
        $vehicle = Vehicle::create($request->validated());
        return new VehicleResource($vehicle);
    }

    public function show(Vehicle $vehicle)
    {
        return new VehicleResource($vehicle->load('currentDriver', 'costs', 'maintenanceHistories'));
    }

    public function update(Request $request, Vehicle $vehicle)
    {
        $request->validate([
            'current_driver_id' => 'nullable|integer|exists:drivers,id|unique:vehicles,current_driver_id,' . $vehicle->id,
            'plate_number' => 'sometimes|string|max:255|unique:vehicles,plate_number,' . $vehicle->id,
        ]);

        $vehicle->update($request->all());
        return new VehicleResource($vehicle);
    }

    public function destroy(Vehicle $vehicle)
    {
        $vehicle->delete();
        return response()->json(['message' => 'Véhicule supprimé.']);
    }
}