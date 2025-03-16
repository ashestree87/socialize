<?php

namespace App\Http\Controllers\Api;

use App\Models\Role;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class RoleController extends ApiController
{
    /**
     * Display a listing of the roles.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $roles = Role::all();
        return $this->successResponse($roles);
    }

    /**
     * Store a newly created role in storage.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'permissions' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation error', 422, $validator->errors());
        }

        // Generate a slug from the name
        $slug = Str::slug($request->name);
        
        // Check if the slug already exists
        if (Role::where('slug', $slug)->exists()) {
            return $this->errorResponse('A role with this name already exists', 422);
        }

        $role = Role::create([
            'name' => $request->name,
            'slug' => $slug,
            'description' => $request->description,
            'permissions' => $request->permissions,
        ]);

        return $this->successResponse($role, 'Role created successfully', 201);
    }

    /**
     * Display the specified role.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        $role = Role::with('users')->findOrFail($id);
        return $this->successResponse($role);
    }

    /**
     * Update the specified role in storage.
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $role = Role::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'permissions' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation error', 422, $validator->errors());
        }

        // If name is being updated, update the slug as well
        if ($request->has('name') && $request->name !== $role->name) {
            $slug = Str::slug($request->name);
            
            // Check if the slug already exists for another role
            if (Role::where('slug', $slug)->where('id', '!=', $id)->exists()) {
                return $this->errorResponse('A role with this name already exists', 422);
            }
            
            $role->slug = $slug;
        }

        $role->fill($request->only(['name', 'description', 'permissions']));
        $role->save();

        return $this->successResponse($role, 'Role updated successfully');
    }

    /**
     * Remove the specified role from storage.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        $role = Role::findOrFail($id);
        
        // Check if this is a system role that shouldn't be deleted
        if (in_array($role->slug, ['admin', 'user'])) {
            return $this->errorResponse('System roles cannot be deleted', 422);
        }
        
        $role->delete();
        return $this->successResponse(null, 'Role deleted successfully');
    }

    /**
     * Assign a role to a user.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function assignRole(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'role_id' => 'required|exists:roles,id',
            'user_id' => 'required|exists:users,id',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation error', 422, $validator->errors());
        }

        $role = Role::findOrFail($request->role_id);
        $role->users()->syncWithoutDetaching([$request->user_id]);

        return $this->successResponse(null, 'Role assigned successfully');
    }

    /**
     * Remove a role from a user.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function removeRole(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'role_id' => 'required|exists:roles,id',
            'user_id' => 'required|exists:users,id',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation error', 422, $validator->errors());
        }

        $role = Role::findOrFail($request->role_id);
        $role->users()->detach($request->user_id);

        return $this->successResponse(null, 'Role removed successfully');
    }
} 