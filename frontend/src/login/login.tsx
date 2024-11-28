import style from './login.module.css'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../footer/footer'
import logo from '../assets/logo.png';


const Login = () => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');

    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:8080/access/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: email, pass }),
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(error);
            }

            const token = await response.text(); // Obtém o token diretamente como texto
            console.log('Login bem-sucedido, token:', token);
            localStorage.setItem('authToken', token); // Armazena o token no localStorage

            navigate('/');
        } catch (error) {
            console.error('Erro:', error);
        }
    };



    return (
        <>
            <div className={style.header}>
                <Link to="/"><img src={logo} alt="Logo mercado livre" className={style.logo}/></Link>
                <div></div>
                <div></div>
            </div>
            <div className={style.container}>
                <div className={style.title}>
                    <h1>Digite seu e-mail ou telefone para iniciar sessão</h1>
                </div>
                <form className={style.form} onSubmit={(e) => {e.preventDefault();handleLogin();}}>
                    <div className={style.input}>
                        <label className={style.label} htmlFor="usr_email">E-mail</label>
                        <input
                            className={style.campos}
                            type="text"
                            name="usr_email"
                            id="usr_email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className={style.input}>
                        <label className={style.label} htmlFor="usr_pass">Senha</label>
                        <input
                            className={style.campos}
                            type="password"
                            name="usr_pass"
                            id="usr_pass"
                            value={pass}
                            onChange={(e) => setPass(e.target.value)}
                        />
                    </div>
                    <button className={style.botao} type="submit">Entrar</button>
                    <Link to="/cadastro">Criar nova conta</Link>

                </form>
            </div>
            <Footer />

        </>
    );
};

export default Login;
