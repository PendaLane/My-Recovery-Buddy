# Syncing My Recovery Buddy with WordPress (Paid Memberships Pro)

This app can read/write all user data from your WordPress site so accounts and saved content are available on any device. The steps below stay within free tooling.

## 1) Prepare WordPress
1. Ensure **Application Passwords** are enabled (built into WordPress 5.6+). In the WordPress admin, go to **Users → Your Profile → Application Passwords** and create a new password (e.g., "Recovery Buddy API"). Save the generated username:password pair.
2. Install/activate **Paid Memberships Pro (PMPro)** as you already do. Keep the signup/checkout pages published so WordPress creates users when people register.
3. (Optional but recommended) Install the free plugin **“WP REST API Controller”** to confirm your custom endpoints are public.

## 2) Add free custom endpoints for app data
Create a small plugin (no cost) to expose REST endpoints that mirror the front-end calls.

1. On your server, create a folder `wp-content/plugins/penda-recovery-sync/` and add `penda-recovery-sync.php` with the code below.
2. Activate the plugin in **Plugins → Installed Plugins**.

```php
<?php
/**
 * Plugin Name: Penda Recovery Sync
 */

add_action('rest_api_init', function () {
    register_rest_route('penda/v1', '/state', [
        'methods'  => ['GET', 'POST'],
        'permission_callback' => 'penda_recovery_auth',
        'callback' => 'penda_recovery_state',
    ]);

    register_rest_route('penda/v1', '/session-analytics', [
        'methods'  => 'POST',
        'permission_callback' => 'penda_recovery_auth',
        'callback' => 'penda_recovery_session',
    ]);
});

function penda_recovery_auth() {
    return current_user_can('read'); // Application Passwords or logged-in sessions
}

function penda_recovery_state(WP_REST_Request $request) {
    $sessionId = $request->get_param('sessionId');
    $userId    = get_current_user_id();

    if ($request->get_method() === 'GET') {
        $data = get_user_meta($userId, 'penda_state_' . $sessionId, true);
        return [ 'state' => $data ? json_decode($data, true) : null, 'flags' => new stdClass() ];
    }

    $body = json_decode($request->get_body(), true);
    if (!empty($body['state'])) {
        update_user_meta($userId, 'penda_state_' . $sessionId, wp_json_encode($body['state']));
    }
    return [ 'ok' => true ];
}

function penda_recovery_session(WP_REST_Request $request) {
    $payload = json_decode($request->get_body(), true);
    if ($payload) {
        $log = get_option('penda_session_logs', []);
        $log[] = $payload;
        update_option('penda_session_logs', $log, false);
    }
    return ['ok' => true];
}
```

This stores everything against the WordPress user so it is available on any device without relying on local storage.

## 3) Point the app at WordPress
1. In the web app environment, set `VITE_BACKEND_BASE_URL=https://pendalane.com/wp-json/penda/v1`.
2. Deploy/build the app (`npm run build`) so the front end reads/writes to the WordPress REST routes instead of `/api`.
3. When a user signs in through the app, authenticate requests using the Application Password header:
   - `Authorization: Basic base64(username:application-password)`
   - You can proxy this server-side if you don’t want the password exposed to the browser.

## 4) Keep PMPro registrations in sync
- Users who register via PMPro already become WordPress users. The React app should reuse those accounts by signing in with the same username/email.
- To force app signups to create WordPress users, enable PMPro’s built-in registration form or call `wp-json/wp/v2/users` with Basic Auth from your backend (free core endpoint).

## 5) Data you can map
- **Contacts, journal entries, meeting logs, step work, streaks, and profile** are saved in the `state` blob shown above. You can also split them into dedicated custom post types if you prefer structured queries (no extra plugin required).
- Media uploads (avatars) can be sent to `wp-json/wp/v2/media` with the same Application Password; return the hosted URL to store in the profile.

## 6) Zero-cost deployment checklist
- ✅ WordPress core + Paid Memberships Pro (free tier)
- ✅ Application Passwords (core) for secure REST access
- ✅ Small custom plugin above for state storage
- ✅ Optional: WP REST API Controller for visibility of endpoints

Once these pieces are in place, every login pulls the user’s data from WordPress and saves back automatically, keeping accounts portable across devices.
