<?php

namespace App\Policies;

use App\Models\OperationEvent;
use App\Models\User;
use App\Support\AccessScope;
use App\Support\RoleGroups;

class OperationEventPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(explode('|', RoleGroups::OPERATION_EVENT_READERS));
    }

    public function view(User $user, OperationEvent $operationEvent): bool
    {
        if (!$this->viewAny($user)) {
            return false;
        }

        if ($user->hasAnyRole(['client', 'driver'])) {
            return $operationEvent->operation
                ? AccessScope::canAccessOperation($user, $operationEvent->operation)
                : false;
        }

        return $user->hasAnyRole(explode('|', RoleGroups::STAFF));
    }

    public function create(User $user): bool
    {
        return $user->hasAnyRole(explode('|', RoleGroups::DIRECTION));
    }

    public function update(User $user, OperationEvent $operationEvent): bool
    {
        return $user->hasAnyRole(explode('|', RoleGroups::DIRECTION));
    }

    public function delete(User $user, OperationEvent $operationEvent): bool
    {
        return $user->hasAnyRole(explode('|', RoleGroups::DIRECTION));
    }
}
