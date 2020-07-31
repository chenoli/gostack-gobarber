import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  InputHTMLAttributes,
} from 'react';

import { useField } from '@unform/core';
import { IconBaseProps } from 'react-icons';
import { FiAlertCircle } from 'react-icons/fi';

import { Container, Error } from './styles';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  containerStyle?: object; // eslint-disable-line
  icon: React.ComponentType<IconBaseProps>;
}

const Input: React.FC<InputProps> = ({
  name,
  containerStyle = {},
  icon: Icon,
  ...rest
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { fieldName, defaultValue, error, registerField } = useField(name);

  const [hasFocus, setHasFocus] = useState(false);
  const [hasContent, setHasContent] = useState(false);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
    });
  }, [fieldName, registerField]);

  const handleOnFocus = useCallback(() => {
    setHasFocus(true);
  }, []);

  const handleOnBlur = useCallback(() => {
    setHasFocus(false);
    setHasContent(!!inputRef.current?.value);
  }, []);

  return (
    <Container
      style={containerStyle}
      hasError={!!error}
      hasFocus={hasFocus}
      hasContent={hasContent}
    >
      {Icon && <Icon size={20} />}
      <input
        ref={inputRef}
        defaultValue={defaultValue}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
        {...rest}
      />
      {error && (
        <Error title={error}>
          <FiAlertCircle color="#c53030" size={20} />
        </Error>
      )}
    </Container>
  );
};

export default Input;
