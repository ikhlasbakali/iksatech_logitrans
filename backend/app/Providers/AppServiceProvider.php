<?php

namespace App\Providers;

use App\Models\Client;
use App\Models\Document;
use App\Models\DocumentAuditLog;
use App\Models\Incident;
use App\Models\Message;
use App\Models\Operation;
use App\Models\OperationEvent;
use App\Models\SalesQuote;
use App\Models\User;
use App\Observers\UserObserver;
use App\Policies\ClientPolicy;
use App\Policies\DocumentAuditLogPolicy;
use App\Policies\DocumentPolicy;
use App\Policies\IncidentPolicy;
use App\Policies\MessagePolicy;
use App\Policies\OperationEventPolicy;
use App\Policies\OperationPolicy;
use App\Policies\SalesQuotePolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    protected $policies = [
        Operation::class => OperationPolicy::class,
        Document::class => DocumentPolicy::class,
        Message::class => MessagePolicy::class,
        SalesQuote::class => SalesQuotePolicy::class,
        OperationEvent::class => OperationEventPolicy::class,
        Incident::class => IncidentPolicy::class,
        DocumentAuditLog::class => DocumentAuditLogPolicy::class,
        Client::class => ClientPolicy::class,
    ];

    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        User::observe(UserObserver::class);

        foreach ($this->policies as $model => $policy) {
            Gate::policy($model, $policy);
        }
    }
}
