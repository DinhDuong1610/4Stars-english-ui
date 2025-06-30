import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/router/router.config.tsx';
import 'antd/dist/reset.css';
import 'styles/main.scss';
import { ConfigProvider } from 'antd';
import enUS from 'antd/locale/en_US';
import viVN from 'antd/locale/vi_VN';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider locale={enUS}>
      <RouterProvider router={router} />
    </ConfigProvider>
  </React.StrictMode>,
);