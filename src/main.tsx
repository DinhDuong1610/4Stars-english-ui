import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/router/router.config.tsx';
import 'antd/dist/reset.css';
import 'styles/main.scss';
import { ConfigProvider, Spin } from 'antd';
import enUS from 'antd/locale/en_US';
import viVN from 'antd/locale/vi_VN';
import ThemeProviderWrapper from '@/theme/theme-provider';
import '@/i18n';
import { WebSocketProvider } from '@/context/websocket.context';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider locale={enUS}>
      <ThemeProviderWrapper>
        <WebSocketProvider>
          <RouterProvider router={router} />
        </WebSocketProvider>
      </ThemeProviderWrapper>
    </ConfigProvider>
  </React.StrictMode >,
);