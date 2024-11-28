import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './homepage/Home';
import Header from './header/Header';
import ProductDetail from './productDetails/ProductDetail';
import CadastroProduto from './cadastroProdutos/CadastroProduto';
import Login from './login/login';
import Cadastro from './cadastro/cadastro'
import Footer from './footer/footer'

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/header" element={<Header />} />
                <Route path="/product/:id" element={<ProductDetail />} /> {/* Rota dinâmica */}
                <Route path="/CadastroProduto" element={<CadastroProduto/>}> </Route>
                <Route path="/login" element={<Login/>}> </Route>
                <Route path="/cadastro" element={<Cadastro/>}> </Route>
                <Route path="/footer" element={<Footer/>}> </Route>

            </Routes>
        </Router>
    );
};

export default App;
