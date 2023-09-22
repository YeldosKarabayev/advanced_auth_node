import {useState, useEffect} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import './RegisterScreen.css';

const RegisterScreen = ({ history }) => {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if(localStorage.getItem("authToken")) {
            history.push("/");
        }
    }, [history])


    const registerHandler = async (e) => {
        e.preventDefault();

        const config = {
            header: {
                "Content-Type": "appliaction/json"
            }
        }

        if(password !== confirmPassword) {
            setPassword("");
            setConfirmPassword("");
            setTimeout(() =>{
                setError("")
            }, 5000);
            return setError("Пароли не совпадают");
        }

        try {
            const {data} = await axios.post("/api/auth/register", {username,email, password},
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


    <div className='register-screen'>
        <form onSubmit={registerHandler} className='register-screen__form'>
            <h3 className='register-screen__title'>Рагистрация</h3>
            {error && <span className='error-message' >{error}</span>}
            <div className='form-group'>
                <label htmlFor='name'>Имя пользователя:</label>
                <input 
                    type='text' 
                    required 
                    id='name' 
                    placeholder='Enter username' 
                    value = {username} 
                    onChange={() => setUsername(e.terget.value)} 
                />
            </div>

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

            <div className='form-group'>
                <label htmlFor='Confirmpassword'>Подтвердите пароль:</label>
                <input 
                    type='text' 
                    required 
                    id='confirmpassword' 
                    placeholder='Confirm password' 
                    value = {confirmPassword} 
                    onChange={() => setConfirmPassword(e.terget.value)} 
                />
            </div>

            <button type='submit' className='btn btn-primary'>Регистрироватся</button>

            <span>У вас уже есть учетная запись?
                <Link to="/login">Войти</Link></span>
        </form>
    </div>
};

export default RegisterScreen;