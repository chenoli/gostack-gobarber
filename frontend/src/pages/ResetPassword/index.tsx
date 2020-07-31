import React, { useCallback, useRef } from 'react';

import * as Yup from 'yup';
import { Form } from '@unform/web';
import { FiLock } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { useHistory, useLocation } from 'react-router-dom';

import { AnimationContainer, Background, Container, Content } from './styles';

import api from '../../services/api';
import logo from '../../assets/logo.svg';
import { useToast } from '../../hooks/toast';
import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';

interface ResetPasswordFormData {
  password: string;
  password_confirmation: string;
}

const ResetPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();

  const history = useHistory();
  const location = useLocation();

  const handleOnSubmit = useCallback(
    async (data: ResetPasswordFormData) => {
      formRef.current?.setErrors({});

      try {
        const schema = Yup.object().shape({
          password: Yup.string().required('A senha é obrigatória.'),
          password_confirmation: Yup.string().oneOf(
            [Yup.ref('password'), undefined],
            'As senhas não conferem',
          ),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const { password, password_confirmation } = data;
        const token = location.search.replace('?token=', '');

        if (!token) {
          addToast({
            type: 'error',
            title: 'Erro ao resetar a senha!',
            description: 'O link está expirado ou inválido',
          });

          return;
        }

        await api.post('/password/reset', {
          password,
          password_confirmation,
          token,
        });

        history.push('/');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          formRef.current?.setErrors(getValidationErrors(err));
        } else {
          addToast({
            type: 'error',
            title: 'Erro ao resetar a senha!',
            description: 'Verifique sua conexão e tente novamente',
          });
        }
      }
    },
    [addToast, history, location.search],
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logo} alt="GoBarber" />
          <Form ref={formRef} onSubmit={handleOnSubmit}>
            <h1>Resetar sua senha</h1>
            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Nova senha"
            />
            <Input
              name="password_confirmation"
              icon={FiLock}
              type="password"
              placeholder="Confirmação da senha"
            />
            <Button type="submit">Entrar</Button>
          </Form>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default ResetPassword;
