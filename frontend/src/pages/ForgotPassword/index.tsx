import React, { useCallback, useRef, useState } from 'react';

import * as Yup from 'yup';
import { Form } from '@unform/web';
import { Link } from 'react-router-dom';
import { FormHandles } from '@unform/core';
import { FiLogIn, FiMail } from 'react-icons/fi';

import { AnimationContainer, Background, Container, Content } from './styles';

import logo from '../../assets/logo.svg';
import { useToast } from '../../hooks/toast';
import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';
import api from '../../services/api';

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const [loading, setLoading] = useState(false);

  const { addToast } = useToast();

  const handleOnSubmit = useCallback(
    async (data: ForgotPasswordFormData) => {
      formRef.current?.setErrors({});

      try {
        setLoading(true);

        const schema = Yup.object().shape({
          email: Yup.string()
            .email('Digite um email válido.')
            .required('O email é obrigatório.'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('/password/forgot', { email: data.email });

        addToast({
          type: 'success',
          title: 'Envio de recuperação de senha enviado!',
          description: `Um email de instruções foi enviado para ${data.email}`,
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          formRef.current?.setErrors(getValidationErrors(err));
        } else {
          addToast({
            type: 'error',
            title: 'Erro na recuperação de senha!',
            description: 'Verifique sua conexão e tente novamente',
          });
        }
      } finally {
        setLoading(false);
      }
    },
    [addToast],
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logo} alt="GoBarber" />
          <Form ref={formRef} onSubmit={handleOnSubmit}>
            <h1>Recuperar senha</h1>
            <Input name="email" icon={FiMail} placeholder="Email" />
            <Button loading={loading} type="submit">
              Recuperar
            </Button>
          </Form>
          <Link to="/">
            <FiLogIn />
            voltar
          </Link>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default ForgotPassword;
