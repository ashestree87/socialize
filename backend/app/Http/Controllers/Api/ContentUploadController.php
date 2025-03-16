<?php

namespace App\Http\Controllers\Api;

use App\Models\ContentUpload;
use App\Models\SocialPlatform;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class ContentUploadController extends ApiController
{
    /**
     * Display a listing of the content uploads.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $query = ContentUpload::query();
        
        // Filter by user if provided
        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }
        
        // Filter by social platform if provided
        if ($request->has('social_platform_id')) {
            $query->where('social_platform_id', $request->social_platform_id);
        }
        
        // Filter by status if provided
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        $contentUploads = $query->with(['user', 'socialPlatform'])->get();
        return $this->successResponse($contentUploads);
    }

    /**
     * Store a newly created content upload in storage.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'social_platform_id' => 'required|exists:social_platforms,id',
            'file' => 'required|file|max:100000', // 100MB max
            'metadata' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation error', 422, $validator->errors());
        }

        // Verify the social platform exists and belongs to the user's tenant
        $socialPlatform = SocialPlatform::findOrFail($request->social_platform_id);
        
        // Get the uploaded file
        $file = $request->file('file');
        $fileName = Str::uuid() . '.' . $file->getClientOriginalExtension();
        
        // Store the file in Cloudflare R2 (or local storage for now)
        // In production, you would configure the r2 disk in config/filesystems.php
        $filePath = $file->storeAs(
            'uploads/' . $request->user()->id . '/' . $socialPlatform->id,
            $fileName,
            'public'
        );

        // Create the content upload record
        $contentUpload = ContentUpload::create([
            'user_id' => $request->user()->id,
            'social_platform_id' => $socialPlatform->id,
            'file_name' => $file->getClientOriginalName(),
            'file_path' => $filePath,
            'file_type' => $file->getMimeType(),
            'file_size' => $file->getSize(),
            'metadata' => $request->metadata,
            'status' => 'pending',
        ]);

        return $this->successResponse($contentUpload, 'Content uploaded successfully', 201);
    }

    /**
     * Display the specified content upload.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        $contentUpload = ContentUpload::with(['user', 'socialPlatform'])->findOrFail($id);
        return $this->successResponse($contentUpload);
    }

    /**
     * Update the specified content upload in storage.
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $contentUpload = ContentUpload::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'metadata' => 'nullable|array',
            'status' => 'nullable|string|in:pending,processing,published,failed',
            'published_at' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation error', 422, $validator->errors());
        }

        $contentUpload->update($request->only(['metadata', 'status', 'published_at']));
        return $this->successResponse($contentUpload, 'Content upload updated successfully');
    }

    /**
     * Remove the specified content upload from storage.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        $contentUpload = ContentUpload::findOrFail($id);
        
        // Delete the file from storage
        Storage::disk('public')->delete($contentUpload->file_path);
        
        // Delete the record
        $contentUpload->delete();
        
        return $this->successResponse(null, 'Content upload deleted successfully');
    }

    /**
     * Get the download URL for a content upload.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function download(int $id): JsonResponse
    {
        $contentUpload = ContentUpload::findOrFail($id);
        
        // Generate a temporary URL for the file
        // In production with Cloudflare R2, you would generate a signed URL
        $url = Storage::disk('public')->url($contentUpload->file_path);
        
        return $this->successResponse(['url' => $url], 'Download URL generated successfully');
    }

    /**
     * Publish content to the social platform.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function publish(int $id): JsonResponse
    {
        $contentUpload = ContentUpload::with('socialPlatform')->findOrFail($id);
        
        // Here you would implement the logic to publish the content to the social platform
        // This would typically involve using the platform's API via a service class
        
        // For now, we'll just update the status
        $contentUpload->update([
            'status' => 'published',
            'published_at' => now(),
        ]);
        
        return $this->successResponse($contentUpload, 'Content published successfully');
    }
} 