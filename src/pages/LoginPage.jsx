import React from 'react';
import AuthForm from '../components/AuthForm';

const LoginPage = () => (
    <div>
        <h1>Login</h1>
        <AuthForm isLogin={true} />
    </div>
);

export default LoginPage;
