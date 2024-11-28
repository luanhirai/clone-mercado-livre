import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import style from './productDetails.module.css';
import Header from '../header/Header'
import Footer from '../footer/footer'


const ProductDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<any>(null);
    const [imageSrc, setImageSrc] = useState<string>('');

    const navigate = useNavigate();

    const [chatMessages, setChatMessages] = useState<{ type: string; text: string }[]>([]); // Estado para o chat
    const [questionText, setQuestionText] = useState<string>('');

    const [quest, setQuest] = useState([]);

    const [userAd, setUserAd] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const token = localStorage.getItem('authToken');



    useEffect(() => {
        const fetchUserInfo = async () => {
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

        fetchUserInfo(); // Chama a função assíncrona
    }, [token]);





    useEffect(() => {
        if (id) {
            fetch(`http://localhost:8080/apis/ad/get-questions?adId=${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Erro na resposta da requisição');
                }
            })
            .then(data => {
                console.log('Perguntas recebidas:', data); 
                setQuest(data);  
            })
            .catch(error => console.error('Erro ao buscar perguntas:', error));
        }
    }, [id]);
    
    







    const handleSendQuestion = async () => {
        if (!questionText.trim()) {
            alert('A pergunta não pode estar vazia.');
            return;
        }
    
        try {
            const response = await fetch('http://localhost:8080/apis/ad/add-question', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: questionText,
                    resp: "", 
                    ad: { id }, 
                }),
            });
    
            if (response.ok) {
                console.log("Pergunta salva com sucesso!");
                setQuestionText(''); 
            } else {
                const errorMessage = await response.text();
                console.error('Erro ao salvar pergunta:', errorMessage);
                alert(`Erro: ${errorMessage}`);
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
            alert('Ocorreu um erro ao enviar a pergunta.');
        }
    };
    







    const fetchDelete = async () => {
        try {
            const response = await fetch(`http://localhost:8080/apis/ad/delete?id=${product.id}`, {
                method: "POST",
                headers: {
                    'Content-type': 'application/json'
                },
            });

            if (response.ok) {
                console.log("Produto excluido com sucesso!");
                navigate("/");
            }
            else {
                console.error('Erro na resposta da api');
            }
        } catch (error) {
            console.log('Erro na requisição: ', error);
        }
    };




    useEffect(() => {
        console.log('Tentando buscar o produto com ID:', id);
        fetch(`http://localhost:8080/apis/ad/get-one?id=${id}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Basic ' + btoa('user:senha_fixa'),
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                console.log('Resposta do fetch:', response);
                return response.json();
            })
            .then(data => {
                console.log('Dados do produto:', data);
                setProduct(data);
            })
            .catch(error => console.error('Erro ao buscar o produto:', error));
    }, [id]);



    useEffect(() => {
        if (product) {
            const fetchImage = async () => {
                try {
                    const response = await axios.get(`http://localhost:8080/apis/ad/get-one-image?id=${id}`, {
                        responseType: 'arraybuffer',
                    });

                    const base64Image = btoa(
                        new Uint8Array(response.data)
                            .reduce((data, byte) => data + String.fromCharCode(byte), '')
                    );

                    const imageBase64Url = `data:image/jpeg;base64,${base64Image}`;
                    setImageSrc(imageBase64Url);
                } catch (err) {
                    console.error('Erro ao carregar a imagem:', err);
                }
            };

            fetchImage();
        }
    }, [product, id]);






    useEffect(() => {
        if(userInfo && userInfo.level==='2')
            setUserAd(true);
        else if (userInfo && product && userInfo.id == product.user.id) {
            console.log('user :', userInfo.id, '  produto', product.user.id)
            setUserAd(true);
        }
    }, [userInfo, product]);



    return (
        <>
            <Header />
            <div className={style.container}>
                {product ? (
                    <div className={style.productDetail}>

                        <img src={imageSrc} alt={product.name} className={style.image} />
                        <div></div>
                        <div className={style.detalhes}>
                            {userAd ? (
                                <input type="button" value="Excluir" onClick={() => fetchDelete()} />
                            ) : (null)}
                            <h1 className={style.title}>{product.title}</h1>
                            <p className={style.price}>R$ {product.price}</p>
                            <p className={style.description}>{product.descr}</p>
                            <p>Tipo de categoria: {product.category.name}</p>
                            <p>Produto postado por : {product.user.name}</p>
                        </div>
                    </div>
                ) : (
                    <p className={style.loading}>Carregando...</p>
                )}
            </div>

            <div className={style.container_chat}>
                <div className={style.chat}>
                    {quest.length > 0 ? (
                        quest.map((quest, index) => (
                            <div key={index} className={style.pergunta}>
                                <p>{quest.text}</p>
                            </div>
                        ))
                    ) : (
                        <p>Sem perguntas</p>
                    )}
                </div>

                <div className={style.chatInput}>
                    <input
                        type="text"
                        placeholder="Faça uma pergunta"
                        className={style.question}
                        value={questionText}
                        onChange={(e) => setQuestionText(e.target.value)}
                    />
                    <input
                        type="button"
                        value="Enviar"
                        className={style.button}
                        onClick={handleSendQuestion}
                    />
                </div>
            </div>


            <Footer />
        </>
    );
};

export default ProductDetail;
