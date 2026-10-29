export const saveSession = ({ token, role, customer, supplier, admin }) => {
  localStorage.setItem('authToken', token);
  localStorage.setItem('authRole', role);
  const account = customer || supplier || admin;
  if (account?.id) {
    localStorage.setItem('accountId', account.id);
  }
};

export const clearSession = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('authRole');
  localStorage.removeItem('accountId');
};

export const getSessionRole = () => localStorage.getItem('authRole');
