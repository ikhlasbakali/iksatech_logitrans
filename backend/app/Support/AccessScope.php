<?php

namespace App\Support;

use App\Models\Operation;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;

final class AccessScope
{
    public static function clientIdFor(User $user): ?int
    {
        return $user->clientProfile?->id;
    }

    public static function driverIdFor(User $user): ?int
    {
        return $user->driverProfile?->id;
    }

    public static function scopeOperations(Builder $query, User $user): Builder
    {
        if ($user->hasRole('client')) {
            $clientId = self::clientIdFor($user);

            return $clientId
                ? $query->where('client_id', $clientId)
                : $query->whereRaw('0 = 1');
        }

        if ($user->hasRole('driver')) {
            $driverId = self::driverIdFor($user);

            if (!$driverId) {
                return $query->whereRaw('0 = 1');
            }

            return $query->where(function (Builder $builder) use ($driverId) {
                $builder->where('driver_1_id', $driverId)
                    ->orWhere('driver_2_id', $driverId);
            });
        }

        return $query;
    }

    public static function canAccessOperation(User $user, Operation $operation): bool
    {
        if ($user->hasRole('client')) {
            $clientId = self::clientIdFor($user);

            return $clientId !== null && (int) $operation->client_id === (int) $clientId;
        }

        if ($user->hasRole('driver')) {
            $driverId = self::driverIdFor($user);

            return $driverId !== null && in_array(
                (int) $driverId,
                [(int) $operation->driver_1_id, (int) $operation->driver_2_id],
                true
            );
        }

        return true;
    }

    public static function scopeThroughOperation(Builder $query, User $user, string $operationForeignKey = 'operation_id'): Builder
    {
        return $query->whereHas('operation', function (Builder $operationQuery) use ($user) {
            self::scopeOperations($operationQuery, $user);
        });
    }

    public static function scopeSalesQuotes(Builder $query, User $user): Builder
    {
        if ($user->hasRole('client')) {
            $clientId = self::clientIdFor($user);

            return $clientId
                ? $query->where('client_id', $clientId)
                : $query->whereRaw('0 = 1');
        }

        return $query;
    }

    public static function scopeMessages(Builder $query, User $user): Builder
    {
        if ($user->hasRole('client')) {
            return self::scopeThroughOperation($query, $user);
        }

        if ($user->hasRole('driver')) {
            return self::scopeThroughOperation($query, $user);
        }

        return $query;
    }

    public static function canAccessSalesQuote(User $user, $quote): bool
    {
        if ($user->hasRole('client')) {
            $clientId = self::clientIdFor($user);

            return $clientId !== null && (int) $quote->client_id === (int) $clientId;
        }

        return true;
    }

    public static function canAccessMessage(User $user, $message): bool
    {
        if ($user->hasAnyRole(['client', 'driver'])) {
            if (!$message->operation_id) {
                return (int) $message->sender_id === (int) $user->id
                    || (int) $message->receiver_id === (int) $user->id;
            }

            return $message->operation
                ? self::canAccessOperation($user, $message->operation)
                : false;
        }

        return true;
    }
}
