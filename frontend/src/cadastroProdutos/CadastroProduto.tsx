import { useEffect, useState } from 'react';
import axios from 'axios';
import style from './cadastroProduto.module.css';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

function AdForm() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState([]); // Lista de categorias
    const [image, setImage] = useState(null);

    const navigate = useNavigate();
    const token = localStorage.getItem('authToken');
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            if (!token) return;
            try {
                const response = await axios.get('http://localhost:8080/access/getInfoUser', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setUserInfo(response.data);
            } catch (e) {
                console.error('Erro ao buscar informações do usuário:', e);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:8080/apis/cat/getCat');
                setCategories(response.data); // Salva as categorias no estado
            } catch (e) {
                console.error('Erro ao buscar categorias:', e);
            }
        };

        fetchUserInfo();
        fetchCategories();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('ad', JSON.stringify({
            title,
            descr: description,
            price: parseFloat(price),
            category: { id: categoryId },
            user: { id: userInfo.id },
        }));
        formData.append('image', image);

        try {
            await axios.post('http://localhost:8080/apis/ad/add', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            navigate('/');
        } catch (error) {
            console.error('Erro ao salvar anúncio e imagem', error);
        }
    };

    return (
        <>
            <div className={style.header}>
                <Link to="/"><img src={logo} alt="Logo mercado livre" className={style.logo} /></Link>
            </div>
            <form onSubmit={handleSubmit} className={style.formContainer}>
                <div className={style.formGroup}>
                    <label htmlFor="title" className={style.label}>Título</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className={style.input}
                    />
                </div>
                <div className={style.formGroup}>
                    <label htmlFor="description" className={style.label}>Descrição</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className={style.textarea}
                    />
                </div>
                <div className={style.formGroup}>
                    <label htmlFor="price" className={style.label}>Preço</label>
                    <input
                        type="number"
                        id="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                        step="0.01"
                        className={style.input}
                    />
                </div>
                <div className={style.formGroup}>
                    <label htmlFor="categoryId" className={style.label}>Categoria</label>
                    <select
                        id="categoryId"
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        required
                        className={style.select}
                    >
                        <option value="" disabled>Selecione uma categoria</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className={style.formGroup}>
                    <label htmlFor="image" className={style.label}>Imagem</label>
                    <input
                        type="file"
                        id="image"
                        onChange={(e) => setImage(e.target.files[0])}
                        className={style.inputFile}
                    />
                </div>
                <button type="submit" className={style.button}>Salvar Anúncio</button>
            </form>
        </>
    );
}

export default AdForm;
