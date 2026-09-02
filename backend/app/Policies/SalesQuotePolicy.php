<?php

namespace App\Policies;

use App\Models\SalesQuote;
use App\Models\User;
use App\Support\AccessScope;
use App\Support\RoleGroups;

class SalesQuotePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(explode('|', RoleGroups::SALES_QUOTE_READERS));
    }

    public function view(User $user, SalesQuote $salesQuote): bool
    {
        if (!$this->viewAny($user)) {
            return false;
        }

        return AccessScope::canAccessSalesQuote($user, $salesQuote);
    }

    public function create(User $user): bool
    {
        return $user->hasAnyRole(['admin', 'manager', 'exploitation_manager', 'agent']);
    }

    public function update(User $user, SalesQuote $salesQuote): bool
    {
        return $user->hasAnyRole(['admin', 'manager', 'exploitation_manager', 'agent']);
    }

    public function delete(User $user, SalesQuote $salesQuote): bool
    {
        return $user->hasAnyRole(['admin', 'manager', 'exploitation_manager', 'agent']);
    }
}
