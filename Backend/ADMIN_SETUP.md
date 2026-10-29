# Admin account setup

Admin registration is intentionally not public. To create the first admin:

1. Add `ADMIN_EMAIL`, `ADMIN_PASSWORD` (at least 12 characters), and optionally `ADMIN_NAME` to the backend's private `.env` file. Do not commit this file.
2. From the `Backend` directory, run `npm run create-admin`.
3. Remove `ADMIN_PASSWORD` from the environment after setup, then sign in at `/admin/login`.

The setup command refuses to overwrite an existing admin account. Admin passwords are hashed before storage.

## Admin dashboard

After signing in, use `/admin` to review supplier applications, approve or reject suppliers, manage customer orders, and resolve support tickets. New supplier registrations remain pending and cannot sign in until approved.

The dashboard also lists customers and suppliers. Account deletion is permanent and requires typing `confirm`. Deleting a supplier removes their products, promotions, inventory logs, notifications, supplier orders, and support tickets; deletion is blocked while they have active orders. Completed customer-order snapshots are retained. Deleting a customer also deletes their customer-order history. Once deleted, an email address can be used to register again.

Customer checkouts containing products from multiple suppliers are split into separate orders. Each supplier can view and update only orders for their own products on the supplier Orders page. Order status changes appear in the customer's order history, and suppliers receive an order alert in their notifications.
