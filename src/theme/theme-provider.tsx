import { ConfigProvider, theme } from 'antd';
import { useThemeStore } from 'stores/theme.store';

const ThemeProviderWrapper = ({ children }: { children: React.ReactNode }) => {
    const { theme: currentTheme } = useThemeStore();

    return (
        <ConfigProvider
            theme={{
                algorithm: currentTheme === 'dark'
                    ? theme.darkAlgorithm
                    : theme.defaultAlgorithm,

                // token: {
                //     colorPrimary: '#00b96b',
                // },
            }}
        >
            {children}
        </ConfigProvider>
    );
};

export default ThemeProviderWrapper;
