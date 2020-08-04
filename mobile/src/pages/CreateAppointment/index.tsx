import React, { useCallback, useEffect, useState, useMemo } from 'react';

import { format } from 'date-fns';
import { Platform, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useRoute, useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

import api from '../../services/api';
import { Provider } from '../Dashboard';
import { useAuth } from '../../hooks/auth';

import {
  Hour,
  Title,
  Header,
  Content,
  Section,
  Calendar,
  Schedule,
  HourText,
  Container,
  UserAvatar,
  BackButton,
  HeaderTitle,
  ProviderName,
  SectionTitle,
  ProvidersList,
  SectionContent,
  ProviderAvatar,
  ProviderContainer,
  OpenDatePickerButton,
  ProvidersListContainer,
  CreateAppointmentButton,
  OpenDatePickerButtonText,
  CreateAppointmentButtonText,
} from './styles';

interface RouteParams {
  provider_id: string;
}

interface AvailabilityItem {
  hour: number;
  available: boolean;
}

const CreateAppointment: React.FC = () => {
  const route = useRoute();
  const { user } = useAuth();
  const { goBack, navigate } = useNavigation();

  const routeParams = route.params as RouteParams;

  const [selectedHour, setSelectedHour] = useState(0);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerShown, setIsDatePickerShown] = useState(false);
  const [availability, setAvailability] = useState<AvailabilityItem[]>([]);

  const [selectedProvider, setSelectedProvider] = useState(
    routeParams.provider_id,
  );

  useEffect(() => {
    api
      .get<Provider[]>('providers')
      .then(response => setProviders(response.data));
  }, []);

  useEffect(() => {
    api
      .get<AvailabilityItem[]>(
        `providers/${selectedProvider}/day-availability`,
        {
          params: {
            day: selectedDate.getDate(),
            year: selectedDate.getFullYear(),
            month: selectedDate.getMonth() + 1,
          },
        },
      )
      .then(response => setAvailability(response.data));
  }, [selectedDate, selectedProvider]);

  const morningAvailability = useMemo(() => {
    return availability
      .filter(({ hour }) => hour < 12)
      .map(({ hour, available }) => {
        return {
          hour,
          available,
          formattedHour: format(new Date().setHours(hour), 'HH:00'),
        };
      });
  }, [availability]);

  const afternoonAvailability = useMemo(() => {
    return availability
      .filter(({ hour }) => hour >= 12)
      .map(({ hour, available }) => {
        return {
          hour,
          available,
          formattedHour: format(new Date().setHours(hour), 'HH:00'),
        };
      });
  }, [availability]);

  const navigateBack = useCallback(() => {
    goBack();
  }, [goBack]);

  const handleSelectProvider = useCallback(provider_id => {
    setSelectedProvider(provider_id);
  }, []);

  const handleToggleDatePicker = useCallback(() => {
    setIsDatePickerShown(state => !state);
  }, []);

  // eslint-disable-next-line
  const handleDateChanged = useCallback((_: any, date: Date | undefined) => {
    if (Platform.OS === 'android') {
      setIsDatePickerShown(false);
    }

    if (date) {
      setSelectedDate(date);
    }
  }, []);

  const handleSelectHour = useCallback((hour: number) => {
    setSelectedHour(hour);
  }, []);

  const handleCreateAppointment = useCallback(async () => {
    try {
      const date = new Date(selectedDate);
      date.setHours(selectedHour);
      date.setMinutes(0);

      await api.post('appointments', {
        date,
        provider_id: selectedProvider,
      });

      navigate('AppointmentCreated', { date: date.getTime() });
    } catch (err) {
      // Alert.alert(
      //   'Erro ao criar agendamento',
      //   'Ocorreu um erro ao criar o agendamento, verifique os dados e tente novamente!',
      // );
      Alert.alert('Erro ao criar agendamento', err.message);
    }
  }, [navigate, selectedDate, selectedHour, selectedProvider]);

  return (
    <Container>
      <Header>
        <BackButton onPress={navigateBack}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>
        <HeaderTitle>Cabeleireiros</HeaderTitle>
        <UserAvatar source={{ uri: user.avatar_url }} />
      </Header>
      <Content>
        <ProvidersListContainer>
          <ProvidersList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={providers}
            renderItem={({ item: provider }) => (
              <ProviderContainer
                selected={provider.id === selectedProvider}
                onPress={() => handleSelectProvider(provider.id)}
              >
                <ProviderAvatar source={{ uri: provider.avatar_url }} />
                <ProviderName selected={provider.id === selectedProvider}>
                  {provider.name}
                </ProviderName>
              </ProviderContainer>
            )}
            keyExtractor={provider => provider.id}
          />
        </ProvidersListContainer>
        <Calendar>
          <Title>Escolha a data</Title>
          <OpenDatePickerButton onPress={handleToggleDatePicker}>
            <OpenDatePickerButtonText>
              Selecionar outra data
            </OpenDatePickerButtonText>
          </OpenDatePickerButton>
          {isDatePickerShown && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="calendar"
              textColor="#f4ede8"
              onChange={handleDateChanged}
            />
          )}
        </Calendar>
        <Schedule>
          <Title>Escolha o Horário</Title>
          <Section>
            <SectionTitle>Manhã</SectionTitle>
            <SectionContent>
              {morningAvailability.map(({ formattedHour, available, hour }) => (
                <Hour
                  enabled={available}
                  selected={selectedHour === hour}
                  key={formattedHour}
                  available={available}
                  onPress={() => handleSelectHour(hour)}
                >
                  <HourText selected={selectedHour === hour}>
                    {formattedHour}
                  </HourText>
                </Hour>
              ))}
            </SectionContent>
          </Section>
          <Section>
            <SectionTitle>Tarde</SectionTitle>
            <SectionContent>
              {afternoonAvailability.map(
                ({ formattedHour, available, hour }) => (
                  <Hour
                    enabled={available}
                    selected={selectedHour === hour}
                    key={formattedHour}
                    available={available}
                    onPress={() => handleSelectHour(hour)}
                  >
                    <HourText selected={selectedHour === hour}>
                      {formattedHour}
                    </HourText>
                  </Hour>
                ),
              )}
            </SectionContent>
          </Section>
        </Schedule>
        <CreateAppointmentButton onPress={handleCreateAppointment}>
          <CreateAppointmentButtonText>Agendar</CreateAppointmentButtonText>
        </CreateAppointmentButton>
      </Content>
    </Container>
  );
};

export default CreateAppointment;
