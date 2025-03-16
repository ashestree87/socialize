<?php

namespace App\Http\Controllers\Api;

use App\Models\Tenant;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TenantController extends ApiController
{
    /**
     * Display a listing of the tenants.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $tenants = Tenant::all();
        return $this->successResponse($tenants);
    }

    /**
     * Store a newly created tenant in storage.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'domain' => 'required|string|unique:tenants,domain',
            'database_name' => 'nullable|string',
            'settings' => 'nullable|array',
            'status' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation error', 422, $validator->errors());
        }

        $tenant = Tenant::create($request->all());
        return $this->successResponse($tenant, 'Tenant created successfully', 201);
    }

    /**
     * Display the specified tenant.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        $tenant = Tenant::findOrFail($id);
        return $this->successResponse($tenant);
    }

    /**
     * Update the specified tenant in storage.
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $tenant = Tenant::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'domain' => 'sometimes|string|unique:tenants,domain,' . $id,
            'database_name' => 'nullable|string',
            'settings' => 'nullable|array',
            'status' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation error', 422, $validator->errors());
        }

        $tenant->update($request->all());
        return $this->successResponse($tenant, 'Tenant updated successfully');
    }

    /**
     * Remove the specified tenant from storage.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        $tenant = Tenant::findOrFail($id);
        $tenant->delete();
        return $this->successResponse(null, 'Tenant deleted successfully');
    }
} 