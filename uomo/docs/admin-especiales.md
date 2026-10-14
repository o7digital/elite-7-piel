# Admin de Especiales — branch `admin`

Vercel serves `/admin/especiales`; WordPress WP2 is the backend. No Railway service or separate database is required. The customer storefront is not linked to this dashboard.

## Connect WP2

1. Restore availability of `https://wp-elite7piel-2.o7digitalgroup.com` if the VPS is unavailable.
2. In WP2, use an administrator or WooCommerce shop manager account. Create an application password in **Users → Profile → Application Passwords**.
3. Open the admin preview, select **Conectar WP2**, and enter the WordPress username and application password.

The browser keeps the authorization only in memory for the current session. Credentials are never written to localStorage, sessionStorage, cookies, source files or the database. Reloading requires reconnecting. The Vercel server forwards authenticated requests to WP2's WooCommerce REST API; WooCommerce enforces permissions. API responses use `private, no-store`.

Before connecting, the dashboard displays the public product snapshot as a reference. Saving and importing are disabled. Purchase costs and margins are never invented.

## Stored data

WooCommerce product metadata `_elite7_admin_specials_v1` stores purchase price, proposed sale price, shipping mode, carrier, shipping cost, amount charged to the customer, delivery days, packaging cost, payment fee percentage, target margin, reference stock, supplier, notes and last edit timestamp. These fields are internal admin data and do not change the storefront checkout or shipping settings.

Default **Guardar en WP2** saves internal data. Checking **Actualizar también el precio público en WooCommerce** additionally replaces the simple product's regular price and removes an existing promotional price. This choice is off by default. Variable/grouped products must have their public prices updated in WordPress.

Saving detects conflicting internal edits and requires a catalog refresh before replacing another user's changes. Import and bulk margin rules save internal data only. Bulk operations report partial progress if a request fails; they are not a transaction across multiple products.

## Calculations

- Revenue = sale price + shipping charged separately to the customer.
- Cost = purchase price + shipping paid + packaging + payment fee on revenue.
- Profit = revenue − cost.
- Margin = profit / revenue × 100.
- Suggested sale price = (purchase + shipping + packaging) / (1 − fee rate − target margin) − separate shipping charge. Round up to cents.

All amounts are MXN and calculations are before taxes. Missing purchase costs produce unknown profit/margin. A target margin plus fee rate of 100% or more has no suggested price.

## Preview delivery

Commit and push `admin`, then run `vercel deploy --yes` from the repository root. Do not use `--prod` for this branch. Share the returned preview URL with `/admin/especiales` appended. Do not merge into `dev` or `main` until requested.

CJ is shown as a future integration; this version makes no CJ requests.

## Validation

Run `node --test tests/*.test.mjs` and `npm run build` from `uomo/`. Browser checks cover desktop/mobile, the calculator, login, saving, bulk margin rules and exports with mocked WP2 responses. A real authenticated WP2 read/write remains necessary when the VPS and account access are available.

References: [WordPress application passwords](https://developer.wordpress.org/advanced-administration/security/application-passwords/), [WooCommerce REST API](https://woocommerce.github.io/woocommerce-rest-api-docs/).
