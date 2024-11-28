import style from './cadastro.module.css'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const cadastro = () =>{

    const [email,setEmail]= useState('');
    const [pass,setPass] = useState('');

    const navigate= useNavigate();
    const handleRegister = async () =>{
        try{
            const response = await fetch('http://localhost:8080/access/register',{
                method:'POST',
                headers:{
                    'Content-type':'application/json',
                },
                body: JSON.stringify({ name: email, pass }),
            });
            
            if (!response.ok) {
                const error = await response.text();
                throw new Error(error);
            }
            
            console.log('Login bem sucedido');
            navigate('/');
        } catch(e){
            console.error(e);
        }
    }


    return(
        <>
        <div className={style.header}>
            <Link to="/"><img src={logo} alt="Logo mercado livre" className={style.logo}/></Link>
            <div></div>
            <div></div>
        </div>
            <div className={style.container}>
                <div className={style.title}>
                    <h1>Digite seu e-mail ou telefone para se cadastrar e iniciar a sessão</h1>
                </div>
                <form className={style.form} onSubmit={(e)=>{e.preventDefault();handleRegister();}}>
                    <div className={style.input}>
                        <label className={style.label} htmlFor="usr_email">E-mail</label>
                        <input className={style.campos} type="text" value={email} onChange={(e)=>setEmail(e.target.value)} name="usr_email" id="usr_email" />
                    </div>

                    <div className={style.input}>
                        <label className={style.label} htmlFor="usr_pass">Senha</label>
                        <input className={style.campos} type="password" value={pass} onChange={(e)=>setPass(e.target.value)} name="usr_pass" id="usr_pass"/>
                    </div>
                    
                    <input className={style.botao} type="submit" value="Cadastrar" />
                    <Link to='/login'>Já tem uma conta?</Link>
                </form>
                    
            </div>
            

        </>
    );
};

export default  cadastro;