import React from 'react';


const Notification = ({ notification }) => {
  const typeClass = notification.type.replace(/\s+/g, '-').toLowerCase(); // Sanitize class name
  return (
      <div className={`notification ${typeClass}`}>
          <strong>{notification.type}:</strong> {notification.message}
      </div>
  );
};

export default Notification;

