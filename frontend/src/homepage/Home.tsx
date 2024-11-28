import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';  // Importando axios
import style from './home.module.css';
import logo from '../assets/logo.png';



const Home = () => {
    const [ads, setAds] = useState([]);
    const [images, setImages] = useState({});  // Para armazenar as imagens base64 de cada anúncio
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState(""); // Estado para pesquisa





    useEffect(() => {
        fetch('http://localhost:8080/apis/ad/get-many', {
            method: 'GET',
            headers: {
                'Authorization': 'Basic ' + btoa('user:senha_fixa'),
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Erro na resposta da requisição');
                }
            })
            .then(data => {
                setAds(data);
                data.forEach(ad => {
                    fetchImage(ad.id);  
                });
            })
            .catch(error => console.error('Erro ao buscar anúncios:', error));
    }, []);

    const fetchImage = async (adId) => {
        try {
            const response = await axios.get(`http://localhost:8080/apis/ad/get-one-image?id=${adId}`, {
                responseType: 'arraybuffer',
            });

            const base64Image = btoa(
                new Uint8Array(response.data)
                    .reduce((data, byte) => data + String.fromCharCode(byte), '')
            );

            setImages(prevState => ({
                ...prevState,
                [adId]: `data:image/jpeg;base64,${base64Image}`,
            }));
        } catch (err) {
            console.error('Erro ao carregar a imagem do anúncio:', err);
        }
    };

    const handleCardClick = (id) => {
        navigate(`/product/${id}`);
    };


    //HEADER ####################################################################################################################################################

    
    const [userInfo, setUserInfo] = useState(null); 
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
                    const data = await response.json(); 
                    setUserInfo(data); 
                    console.log('Informações do usuário:', data);
                } else {
                    console.error('Erro ao obter informações do usuário:', response.status);
                }
            } catch (e) {
                console.error('Erro na requisição:', e);
            }
        };

        fetchUserInfo(); 
    }, [token]); 

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/');
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredAds = ads.filter((ad) =>
        ad.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div>
            <div className={style.header}>
            <Link to="/"><img src={logo} alt="Logo mercado livre" className={style.logo} /></Link>
            <input
                    type="text"
                    placeholder="Buscar produtos, marcas e muito mais..."
                    className={style.input}
                    value={searchQuery}
                    onChange={handleSearchChange} 
                />

            {isAuthenticated ? (
                <>
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
            <div className={style.topGradient}></div>
            <div className={style.allad}>
                <div className={style.anuncios}>
                    <h1>Anúncios Recentes</h1>
                    <div className={style.cardContainer}>
                        {filteredAds.length > 0 ? (
                            filteredAds.map((ad) => {
                                const imageUrl = images[ad.id];

                                return (
                                    <div
                                        className={style.card}
                                        key={ad.id}
                                        onClick={() => handleCardClick(ad.id)}
                                    >
                                        <div className={style.cardPart}>
                                            <p className={style.title}>{ad.title}</p>
                                        </div>

                                        <div className={style.cardPart}>
                                            {imageUrl ? (
                                                <img
                                                    src={imageUrl}
                                                    alt={ad.title}
                                                    className={style.image}
                                                />
                                            ) : (
                                                <p className={style.noImage}>Imagem não disponível</p>
                                            )}
                                        </div>

                                        <div className={style.cardPart}>
                                            <p className={style.price}>R$ {ad.price}</p>
                                            <p className={style.frete}>Frete grátis</p>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p>Sem anúncios correspondentes à pesquisa.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
