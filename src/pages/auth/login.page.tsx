import { LoginForm, ProFormText } from '@ant-design/pro-form';
import { Card, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { loginAPI } from 'services/auth.service';
import type { ILoginCredentials } from 'types/auth.type';
import { useAuthStore } from 'stores/auth.store';

const LoginPage = () => {
    const navigate = useNavigate();
    const { setAccessToken, setUser } = useAuthStore();

    const handleLogin = async (values: ILoginCredentials) => {
        try {
            const res = await loginAPI(values);
            if (res && res.data) {
                setAccessToken(res.data.accessToken);
                setUser(res.data.user);
                message.success('Login successful!');
                if (res.data.user.role.name === 'ADMIN') {
                    navigate('/admin');
                } else {
                    navigate('/');
                }
            } else {
                message.error(res.message);
            }
        } catch (error) {
            message.error('An error occurred during login.');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
            <Card title="Admin Login" style={{ width: 450 }}>
                <LoginForm onFinish={handleLogin}>
                    <ProFormText name="username" label="Email" rules={[{ required: true }]} />
                    <ProFormText.Password name="password" label="Password" rules={[{ required: true }]} />
                </LoginForm>
            </Card>
        </div>
    );
};

export default LoginPage;