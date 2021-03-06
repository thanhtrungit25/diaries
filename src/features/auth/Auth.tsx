import React, { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { User } from '../../interfaces/user.interface';
import * as yup from 'yup';
import http from '../../services/api';
import { setUser } from './userSlice';
import { AuthResponse } from '../../services/migrate/routes/user';
import { saveToken, setAuthState } from './authSlice';

const schema = yup.object().shape({
  username: yup
    .string()
    .required('What? No username?')
    .max(16, 'Username cannnot be longer than 16 characters'),
  password: yup.string().required('Please enter password'),
  email: yup.string().email('Please provide valid email password'),
});

const Auth: FC = () => {
  const { handleSubmit, register, errors } = useForm<User>({
    validationSchema: schema,
  });

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const submitForm = (data: User) => {
    const path = isLogin ? '/auth/login' : '/auth/signup';
    http
      .post<User, AuthResponse>(path, data)
      .then((res) => {
        if (res) {
          const { user, token } = res;
          dispatch(setUser(user));
          dispatch(saveToken(token));
          dispatch(setAuthState(true));
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="auth">
      <div className="card">
        <form onSubmit={handleSubmit(submitForm)}>
          <div className="inputWrapper">
            <input ref={register} name="username" placeholder="Username" />
            {errors && errors.username && (
              <p className="error">{errors.username.message}</p>
            )}
          </div>

          <div className="inputWrapper">
            <input
              ref={register}
              name="password"
              type="password"
              placeholder="Password"
            />
            {errors.password && <p>{errors.password.message}</p>}
          </div>

          {!isLogin && (
            <div className="inputWrapper">
              <input ref={register} name="email" placeholder="Email" />
              {errors.email && <p>{errors.email.message}</p>}
            </div>
          )}

          <p
            onClick={() => setIsLogin(!isLogin)}
            style={{ cursor: 'pointer', opacity: 0.7 }}
          >
            {isLogin ? 'No account, Create one' : 'Already have an account?'}
          </p>

          <div className="inputWrapper">
            <button type="submit" disabled={loading}>
              {isLogin ? 'Login' : 'Create account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;
