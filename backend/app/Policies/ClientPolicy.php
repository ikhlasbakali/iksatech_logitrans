<?php

namespace App\Policies;

use App\Models\Client;
use App\Models\User;
use App\Support\RoleGroups;

class ClientPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(explode('|', RoleGroups::DIRECTION));
    }

    public function view(User $user, Client $client): bool
    {
        if ($user->hasRole('client')) {
            return (int) $client->user_id === (int) $user->id;
        }

        return $this->viewAny($user);
    }

    public function create(User $user): bool
    {
        return $this->viewAny($user);
    }

    public function update(User $user, Client $client): bool
    {
        return $this->viewAny($user);
    }

    public function delete(User $user, Client $client): bool
    {
        return $user->hasAnyRole(explode('|', RoleGroups::DIRECTION));
    }
}
