<?php

namespace App\Policies;

use App\Models\Operation;
use App\Models\User;
use App\Support\AccessScope;
use App\Support\RoleGroups;

class OperationPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(explode('|', RoleGroups::OPERATION_READERS));
    }

    public function view(User $user, Operation $operation): bool
    {
        if (!$this->viewAny($user)) {
            return false;
        }

        return AccessScope::canAccessOperation($user, $operation);
    }

    public function create(User $user): bool
    {
        return $user->hasAnyRole(explode('|', RoleGroups::DIRECTION));
    }

    public function update(User $user, Operation $operation): bool
    {
        if ($user->hasRole('driver')) {
            return AccessScope::canAccessOperation($user, $operation);
        }

        return $user->hasAnyRole(explode('|', RoleGroups::DIRECTION));
    }

    public function delete(User $user, Operation $operation): bool
    {
        return $user->hasAnyRole(explode('|', RoleGroups::DIRECTION));
    }
}
