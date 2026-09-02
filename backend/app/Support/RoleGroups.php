<?php

namespace App\Support;

final class RoleGroups
{
    public const ADMIN = 'admin';

    public const DIRECTION = 'admin|manager|exploitation_manager';

    public const OPERATORS = 'admin|manager|exploitation_manager|agent|support';

    public const STAFF = 'admin|manager|exploitation_manager|agent|support';

    public const OPERATION_READERS = 'admin|manager|exploitation_manager|agent|support|client|driver';

    public const DOCUMENT_READERS = 'admin|manager|exploitation_manager|agent|support|client';

    public const MESSAGE_USERS = 'admin|manager|exploitation_manager|agent|support|client|driver';

    public const SALES_QUOTE_READERS = 'admin|manager|exploitation_manager|agent|client';

    public const OPERATION_EVENT_READERS = 'admin|manager|exploitation_manager|agent|support|client|driver';
}
