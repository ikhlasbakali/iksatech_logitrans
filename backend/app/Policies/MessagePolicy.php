<?php

namespace App\Policies;

use App\Models\Message;
use App\Models\User;
use App\Support\AccessScope;
use App\Support\RoleGroups;

class MessagePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(explode('|', RoleGroups::MESSAGE_USERS));
    }

    public function view(User $user, Message $message): bool
    {
        if (!$this->viewAny($user)) {
            return false;
        }

        return AccessScope::canAccessMessage($user, $message->loadMissing('operation'));
    }

    public function create(User $user): bool
    {
        return $this->viewAny($user);
    }

    public function update(User $user, Message $message): bool
    {
        return $user->hasAnyRole(explode('|', RoleGroups::OPERATORS));
    }

    public function delete(User $user, Message $message): bool
    {
        return $user->hasAnyRole(explode('|', RoleGroups::OPERATORS));
    }
}
