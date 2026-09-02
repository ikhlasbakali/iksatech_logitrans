<?php

namespace App\Policies;

use App\Models\Document;
use App\Models\User;
use App\Support\AccessScope;
use App\Support\RoleGroups;

class DocumentPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(explode('|', RoleGroups::DOCUMENT_READERS));
    }

    public function view(User $user, Document $document): bool
    {
        if (!$this->viewAny($user)) {
            return false;
        }

        if ($user->hasRole('client')) {
            return $document->operation
                ? AccessScope::canAccessOperation($user, $document->operation)
                : false;
        }

        return $user->hasAnyRole(explode('|', RoleGroups::OPERATORS));
    }

    public function create(User $user): bool
    {
        return $user->hasAnyRole(explode('|', RoleGroups::OPERATORS));
    }

    public function update(User $user, Document $document): bool
    {
        return $user->hasAnyRole(explode('|', RoleGroups::OPERATORS));
    }

    public function delete(User $user, Document $document): bool
    {
        return $user->hasAnyRole(explode('|', RoleGroups::OPERATORS));
    }
}
