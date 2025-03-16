<?php

namespace App\Http\Controllers\Api;

use App\Models\SocialPlatform;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SocialPlatformController extends ApiController
{
    /**
     * Display a listing of the social platforms.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $query = SocialPlatform::query();
        
        // Filter by tenant if provided
        if ($request->has('tenant_id')) {
            $query->where('tenant_id', $request->tenant_id);
        }
        
        $socialPlatforms = $query->get();
        return $this->successResponse($socialPlatforms);
    }

    /**
     * Store a newly created social platform in storage.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'tenant_id' => 'required|exists:tenants,id',
            'name' => 'required|string|max:255',
            'platform_type' => 'required|string',
            'credentials' => 'nullable|array',
            'settings' => 'nullable|array',
            'status' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation error', 422, $validator->errors());
        }

        $socialPlatform = SocialPlatform::create($request->all());
        return $this->successResponse($socialPlatform, 'Social platform created successfully', 201);
    }

    /**
     * Display the specified social platform.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        $socialPlatform = SocialPlatform::findOrFail($id);
        return $this->successResponse($socialPlatform);
    }

    /**
     * Update the specified social platform in storage.
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $socialPlatform = SocialPlatform::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'tenant_id' => 'sometimes|exists:tenants,id',
            'name' => 'sometimes|string|max:255',
            'platform_type' => 'sometimes|string',
            'credentials' => 'nullable|array',
            'settings' => 'nullable|array',
            'status' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation error', 422, $validator->errors());
        }

        $socialPlatform->update($request->all());
        return $this->successResponse($socialPlatform, 'Social platform updated successfully');
    }

    /**
     * Remove the specified social platform from storage.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        $socialPlatform = SocialPlatform::findOrFail($id);
        $socialPlatform->delete();
        return $this->successResponse(null, 'Social platform deleted successfully');
    }
} 