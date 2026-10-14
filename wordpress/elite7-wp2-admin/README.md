# Elite 7 WP2 Admin

Install on **WP2 only** (`wp-elite7piel-2.o7digitalgroup.com`) after the VPS is available. Requires WordPress 6+, PHP 7.4+ and WooCommerce.

In WordPress: Plugins → Add New → Upload Plugin → select `elite7-wp2-admin.zip` → Install → Activate. With authorized WP-CLI access: `wp plugin install /path/elite7-wp2-admin.zip --activate` from the WP2 installation.

## Product fields

WooCommerce → Products → Edit → Product data → **Especiales**:

- Fabricante and Distribuidor.
- Purchase price, target margin and proposed sale price in MXN.
- Shipping carrier (Estafeta, DHL, FedEx, UPS, store pickup), shipping cost and amount charged to the customer.
- Packaging, payment commission and estimated delivery days.
- Calculated profit and actual margin, displayed live before taxes.

Existing WooCommerce categories remain in their normal product category panel. Public selling prices remain in WooCommerce's General tab. Internal proposed selling prices never publish automatically.

Data uses `_elite7_admin_specials_v1`, the same authenticated WooCommerce metadata used by the Vercel dashboard. Existing data is retained when installing or deactivating this plugin.

## Client database

WooCommerce → **Clientes Especiales**: private contact records with name, surname, email, phone, company, RFC, address, city, state, postal code, country and notes. They are stored in WordPress posts/postmeta with private status, not in a separate service. Client records do not create customer login accounts, send emails or change orders.

Only administrators and WooCommerce shop managers can access client records. Private REST endpoints `/wp-json/elite7/v1/clients` (GET/POST) and `/clients/{id}` (PUT) use WordPress authentication. Listing is paginated; duplicate emails and conflicting edits are rejected.

The dashboard connects with a WP2 application password. No API key or shared password is bundled in this plugin. No Railway or CJ connection is added.

## Current deployment limitation

The plugin package is prepared and the syntax is checked, but installation and live database verification require WP2/VPS access. Installing the plugin is not claimed until WordPress confirms it is active.
