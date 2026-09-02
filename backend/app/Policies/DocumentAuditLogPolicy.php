<?php

namespace App\Policies;

use App\Models\DocumentAuditLog;
use App\Models\User;
use App\Support\RoleGroups;

class DocumentAuditLogPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(explode('|', RoleGroups::OPERATORS));
    }

    public function view(User $user, DocumentAuditLog $documentAuditLog): bool
    {
        return $this->viewAny($user);
    }

    public function create(User $user): bool
    {
        return $this->viewAny($user);
    }

    public function update(User $user, DocumentAuditLog $documentAuditLog): bool
    {
        return $this->viewAny($user);
    }

    public function delete(User $user, DocumentAuditLog $documentAuditLog): bool
    {
        return $user->hasAnyRole(explode('|', RoleGroups::DIRECTION));
    }
}
