import { LoginForm, ProFormText } from '@ant-design/pro-form';
import { Card, message, Button, Divider, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { loginAPI, loginGoogleAPI } from 'services/auth.service';
import type { ILoginCredentials, ILoginResponse } from 'types/auth.type';
import { useAuthStore } from 'stores/auth.store';
import { GoogleOutlined } from '@ant-design/icons';
import { useGoogleLogin } from '@react-oauth/google';
import styles from './login.page.module.scss';
import { useTranslation } from 'react-i18next';

const { Title } = Typography;

const LoginPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { setAccessToken, setUser } = useAuthStore();

    const handleAuthSuccess = (data: ILoginResponse) => {
        setAccessToken(data.accessToken);
        setUser(data.user);
        message.success('Login successful!');
        if (data.user.role.name === 'ADMIN') {
            navigate('/admin');
        } else {
            navigate('/');
        }
    };

    const handleEmailLogin = async (values: ILoginCredentials) => {
        try {
            const res = await loginAPI(values);
            if (res && res.data) {
                handleAuthSuccess(res.data);
            } else {
                message.error(res.message);
            }
        } catch (error) {
            message.error('An error occurred during login.');
        }
    };

    const handleGoogleLogin = useGoogleLogin({
        flow: 'auth-code',
        onSuccess: async (codeResponse) => {
            try {
                const res = await loginGoogleAPI({ code: codeResponse.code });
                if (res && res.data) {
                    handleAuthSuccess(res.data);
                } else {
                    message.error(res.message);
                }
            } catch (error) {
                message.error('An error occurred during Google login.');
            }
        },
        onError: (errorResponse) => {
            console.error("Google login error", errorResponse);
            message.error('Google login failed.');
        },
    });

    return (
        <div className={styles.container}>
            <Card className={styles.loginCard}>
                <Title level={3} style={{ textAlign: 'center', marginBottom: '24px' }}>
                    {t('login.title')}
                </Title>
                <LoginForm onFinish={handleEmailLogin} submitter={{
                    searchConfig: {
                        submitText: t('login.submit') as string,
                    }
                }}>
                    <ProFormText name="username" label="Email" rules={[{ required: true }]} />
                    <ProFormText.Password name="password" label={t('login.password')} rules={[{ required: true }]} />
                </LoginForm>
                <Divider>{t('login.or')}</Divider>
                <Button
                    icon={<GoogleOutlined />}
                    onClick={() => handleGoogleLogin()}
                    block
                >
                    {t('login.continueWithGoogle')}
                </Button>
            </Card>
        </div>
    );
};

export default LoginPage;
