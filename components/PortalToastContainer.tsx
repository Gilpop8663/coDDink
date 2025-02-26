'use client';

import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Bounce, ToastContainer } from 'react-toastify';

const PortalToastContainer = () => {
  const [toastRoot, setToastRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setToastRoot(document.getElementById('toast-root'));
  }, []);

  return toastRoot
    ? ReactDOM.createPortal(
        <ToastContainer
          position="bottom-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce}
        />,
        toastRoot
      )
    : null;
};

export default PortalToastContainer;
