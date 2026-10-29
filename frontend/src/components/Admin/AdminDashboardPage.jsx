import React, { useCallback, useEffect, useState } from 'react';
import API from '../services/api';
import '../styles/components/admin.css';
import '../styles/components/admin-account-actions.css';

const ORDER_TRANSITIONS = {
  Placed: ['Accepted', 'Cancelled'],
  Accepted: ['Preparing', 'Cancelled'],
  Preparing: ['Ready', 'Cancelled'],
  Ready: ['Completed', 'Cancelled'],
  Completed: [],
  Cancelled: [],
};
const TICKET_STATUSES = ['Open', 'In Progress', 'Resolved'];

const AdminDashboardPage = () => {
  const [summary, setSummary] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    setError('');
    try {
      const [summaryResponse, suppliersResponse, customersResponse, ordersResponse, ticketsResponse] = await Promise.all([
        API.get('/admin/summary'),
        API.get('/admin/suppliers'),
        API.get('/admin/customers'),
        API.get('/admin/orders'),
        API.get('/admin/support-tickets'),
      ]);
      setSummary(summaryResponse.data);
      setSuppliers(suppliersResponse.data.suppliers);
      setCustomers(customersResponse.data.customers);
      setOrders(ordersResponse.data.orders);
      setTickets(ticketsResponse.data.tickets);
    } catch (requestError) {
      const endpoint = requestError.config?.url || 'admin API';
      const status = requestError.response?.status;
      const message = requestError.response?.data?.message || requestError.message;
      const authHint = status === 401 || status === 403
        ? ' Sign out and sign back in with your admin account.'
        : '';
      console.error(`Could not load admin dashboard from ${endpoint} (HTTP ${status || 'no response'}): ${message}`, requestError);
      setError(`Could not load ${endpoint}${status ? ` (HTTP ${status})` : ''}: ${message}.${authHint}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const updateOrderStatus = async (orderId, status) => {
    setError('');
    try {
      await API.patch(`/admin/orders/${orderId}/status`, { status });
      await loadDashboard();
    } catch (requestError) {
      console.error('Could not update order status', requestError);
      setError(requestError.response?.data?.message || 'Unable to update order.');
    }
  };

  const updateTicketStatus = async (ticketId, status) => {
    setError('');
    try {
      await API.patch(`/admin/support-tickets/${ticketId}/status`, { status });
      await loadDashboard();
    } catch (requestError) {
      console.error('Could not update ticket status', requestError);
      setError(requestError.response?.data?.message || 'Unable to update support ticket.');
    }
  };

  const updateSupplierApproval = async (supplierId, approvalStatus) => {
    setError('');
    setNotice('');
    try {
      const { data } = await API.patch(`/admin/suppliers/${supplierId}/approval`, { approvalStatus });
      setNotice(`${data.supplier.name} has been ${approvalStatus.toLowerCase()}.`);
      await loadDashboard();
    } catch (requestError) {
      console.error('Could not update supplier approval', requestError);
      setError(requestError.response?.data?.message || 'Unable to update supplier approval.');
    }
  };

  const deleteAccount = async (accountType, account) => {
    const confirmation = window.prompt(
      `Permanently delete ${account.name} (${account.email}) and related account records? Type confirm to continue.`
    );
    if (confirmation !== 'confirm') return;

    setError('');
    try {
      await API.delete(`/admin/${accountType}/${account._id}`, { data: { confirmation } });
      await loadDashboard();
    } catch (requestError) {
      console.error(`Could not delete ${accountType.slice(0, -1)}`, requestError);
      setError(requestError.response?.data?.message || 'Unable to delete account.');
    }
  };

  if (isLoading) {
    return <main className="admin-page"><p>Loading admin dashboard...</p></main>;
  }

  return (
    <main className="admin-page">
      <header className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">Platform overview</p>
          <h1>Admin dashboard</h1>
          <p>Review accounts, customer orders, and supplier support requests.</p>
        </div>
        <button type="button" className="admin-button" onClick={loadDashboard}>Refresh</button>
      </header>
      {error && <p className="admin-error" role="alert">{error}</p>}
      {notice && <p className="admin-notice" role="status">{notice}</p>}

      <section className="admin-stat-grid" aria-label="Platform totals">
        {summary && Object.entries({
          Suppliers: summary.suppliers,
          'Pending suppliers': summary.pendingSuppliers,
          Customers: summary.customers,
          Products: summary.products,
          'Customer orders': summary.orders,
          'Unresolved tickets': summary.openTickets,
        }).map(([label, value]) => (
          <article className="admin-stat-card" key={label}>
            <p>{label}</p>
            <strong>{value}</strong>
          </article>
        ))}
      </section>

      <section className="admin-section">
        <h2>Suppliers</h2>
        {suppliers.length === 0 ? <p>No suppliers registered.</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Approval</th><th>Joined</th><th>Actions</th></tr></thead>
              <tbody>
                {suppliers.map((supplier) => (
                  <tr key={supplier._id}>
                    <td>{supplier.name}</td>
                    <td>{supplier.email}</td>
                    <td>{supplier.phone || '—'}</td>
                    <td>
                      <span className={`admin-approval-status approval-${supplier.approvalStatus.toLowerCase()}`}>
                        {supplier.approvalStatus}
                      </span>
                      <select
                        aria-label={`Approval status for ${supplier.name}`}
                        value={supplier.approvalStatus}
                        onChange={(event) => updateSupplierApproval(supplier._id, event.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                    <td>{new Date(supplier.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button type="button" className="admin-account-delete" onClick={() => deleteAccount('suppliers', supplier)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="admin-section">
        <h2>Customers</h2>
        {customers.length === 0 ? <p>No customers registered.</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Joined</th><th>Actions</th></tr></thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer._id}>
                    <td>{customer.name}</td>
                    <td>{customer.email}</td>
                    <td>{customer.phone || '—'}</td>
                    <td>{new Date(customer.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button type="button" className="admin-account-delete" onClick={() => deleteAccount('customers', customer)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="admin-section">
        <h2>Customer orders</h2>
        {orders.length === 0 ? <p>No customer orders yet.</p> : orders.map((order) => (
          <article className="admin-record" key={order._id}>
            <div>
              <h3>{order.customerId?.name || 'Customer'} · ${Number(order.totalAmount).toFixed(2)}</h3>
              <p>Supplier: {order.supplierName || 'Supplier account removed'}</p>
              <p>{order.customerId?.email} · {new Date(order.createdAt).toLocaleString()}</p>
              <p>{order.items.map((item) => `${item.productName} × ${item.quantity}`).join(', ')}</p>
            </div>
            <label>
              Order status
              <select value="" onChange={(event) => updateOrderStatus(order._id, event.target.value)}>
                <option value="" disabled>{order.status === 'Completed' ? 'Delivered' : order.status}</option>
                {(ORDER_TRANSITIONS[order.status] || []).map((status) => (
                  <option key={status} value={status}>{status === 'Completed' ? 'Delivered' : status}</option>
                ))}
              </select>
            </label>
          </article>
        ))}
      </section>

      <section className="admin-section">
        <h2>Supplier support tickets</h2>
        {tickets.length === 0 ? <p>No support tickets.</p> : tickets.map((ticket) => (
          <article className="admin-record" key={ticket._id}>
            <div>
              <h3>{ticket.subject}</h3>
              <p>{ticket.supplierId?.name} · {ticket.supplierId?.email}</p>
              <p>{ticket.description}</p>
            </div>
            <label>
              Ticket status
              <select value={ticket.status} onChange={(event) => updateTicketStatus(ticket._id, event.target.value)}>
                {TICKET_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
            </label>
            {ticket.status !== 'Resolved' && (
              <button type="button" className="admin-button" onClick={() => updateTicketStatus(ticket._id, 'Resolved')}>
                Resolve ticket
              </button>
            )}
          </article>
        ))}
      </section>
    </main>
  );
};

export default AdminDashboardPage;
