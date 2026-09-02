<?php

namespace App\Policies;

use App\Models\Incident;
use App\Models\User;
use App\Support\RoleGroups;

class IncidentPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(explode('|', RoleGroups::OPERATORS));
    }

    public function view(User $user, Incident $incident): bool
    {
        return $this->viewAny($user);
    }

    public function create(User $user): bool
    {
        return $this->viewAny($user);
    }

    public function update(User $user, Incident $incident): bool
    {
        return $this->viewAny($user);
    }

    public function delete(User $user, Incident $incident): bool
    {
        return $this->viewAny($user);
    }
}
