import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import style from './header.module.css';
import logo from '../assets/logo.png';

const Header = () => {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null); // Estado para armazenar as informações do usuário
    const token = localStorage.getItem('authToken');
    const isAuthenticated = Boolean(token);

    useEffect(() => {
        const fetchUserInfo = async () => {
            if (!token) {
                console.log("Sem usuário logado!");
                return;
            }

            try {
                const response = await fetch('http://localhost:8080/access/getInfoUser', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json(); // Obtém o JSON do usuário
                    setUserInfo(data); // Define o estado com os dados do usuário
                    console.log('Informações do usuário:', data);
                } else {
                    console.error('Erro ao obter informações do usuário:', response.status);
                }
            } catch (e) {
                console.error('Erro na requisição:', e);
            }
        };

        fetchUserInfo(); // Chama a função assíncrona
    }, [token]); // Adicione `token` como dependência

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/');
    };

    return (
        <div className={style.header}>
            <Link to="/"><img src={logo} alt="Logo mercado livre" className={style.logo} /></Link>
            <input
                type="text"
                placeholder="Buscar produtos, marcas e muito mais..."
                className={style.input}
            />

            {isAuthenticated ? (
                <>
                    {/* Exibe o nome do usuário */}
                    <span className={style.userName}>
                        {userInfo?.name || 'Usuário'}
                    </span>
                    <Link to="/cadastroProduto">Anunciar Produto</Link>
                    <button onClick={handleLogout} className={style.logoutButton}>Sair</button>
                </>
            ) : (
                <Link to="/login">Entrar na conta</Link>
            )}
        </div>
    );
};

export default Header;
