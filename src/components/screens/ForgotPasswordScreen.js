import { useState } from 'react'
import axios from 'axios'
import './ForgotPasswordScreen.css'

const ForgotPasswordScreen = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const forgotPasswordHandler = async (e) => {
        e.preventDefault();

        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        try {
            const { data } = await axios.post(
                "/api/auth/forgotpassword",
                { email },
                config
            );

            setSuccess(data.data)
        } catch (error) {
            setError(error.response.data.error);
            setEmail("");
            setTimeout(() => {
                setError("");
            }, 5000);
        }
    };

    return (
        <div className="forgotpassword-screen">
          <form
            onSubmit={forgotPasswordHandler}
            className="forgotpassword-screen__form"
          >
            <h3 className="forgotpassword-screen__title">Забыли пароль</h3>
            {error && <span className="error-message">{error}</span>}
            {success && <span className="success-message">{success}</span>}
            <div className="form-group">
              <p className="forgotpassword-screen__subtext">
              Пожалуйста, введите адрес электронной почты, на который вы регистрировали свою учетную запись. Мы
              вышлем вам подтверждение сброса пароля на это электронное письмо
              </p>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                required
                id="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Отправить электронное письмо
            </button>
          </form>
        </div>
      );
}

export default ForgotPasswordScreen;