import {useState, useEffect} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import './LoginScreen.css';

const LoginScreen = ({ history }) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if(localStorage.getItem("authToken")) {
            history.push("/");
        }
    }, [history])


    const loginHandler = async (e) => {
        e.preventDefault();

        const config = {
            header: {
                "Content-Type": "appliaction/json"
            }
        };

       
        try {
            const {data} = await axios.post(
                "/api/auth/logn",
                 {email, password},
            config);

            localStorage.setItem("authToken", data.token);

            history.push();
        } catch (error) {
            setError(error.response.data.error);
            setTimeout(() => {
                setError("");
            }, 5000);
        }

    }


    <div className='login-screen'>
        <form onSubmit={loginHandler} className='login-screen__form'>
            <h3 className='login-screen__title'>Логин</h3>
            {error && <span className='error-message' >{error}</span>}

            <div className='form-group'>
                <label htmlFor='email'>Email:</label>
                <input 
                    type='text' 
                    required 
                    id='email' 
                    placeholder='Enter email' 
                    value = {email} 
                    onChange={() => setEmail(e.terget.value)} 
                />
            </div>

            <div className='form-group'>
                <label htmlFor='password'>Пароль:</label>
                <input 
                    type='text' 
                    required 
                    id='password' 
                    placeholder='Enter password' 
                    value = {password} 
                    onChange={() => setPassword(e.terget.value)} 
                />
            </div>

            <button type='submit' className='btn btn-primary'>
               Войти</button>

            <span className='login-screen__suntext'>
            У вас нет учетной записи? 
                <Link to="/login">Зарегистрироватся</Link>
            </span>
        </form>
    </div>
}

export default LoginScreen;