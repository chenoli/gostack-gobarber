import React, { useState, useCallback, useEffect, useMemo } from 'react';

import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

import ptBR from 'date-fns/locale/pt-BR';
import { FiPower, FiClock } from 'react-icons/fi';
import { isToday, format, parseISO, isAfter } from 'date-fns';

import { Link } from 'react-router-dom';
import api from '../../services/api';
import logo from '../../assets/logo.svg';
import { useAuth } from '../../hooks/auth';

import {
  Header,
  Profile,
  Content,
  Section,
  Schedule,
  Calendar,
  Container,
  Appointment,
  HeaderContent,
  NextAppointment,
} from './styles';

interface IMonthAvailabilityItem {
  day: number;
  available: boolean;
}

interface IAppointment {
  id: string;
  date: string;
  formattedHour: string;
  user: {
    name: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const { signOut, user } = useAuth();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [appointments, setAppointments] = useState<IAppointment[]>([]);

  const [monthAvailability, setMonthAvailability] = useState<
    IMonthAvailabilityItem[]
  >([]);

  const disabledDays = useMemo(() => {
    return monthAvailability
      .filter(monthDay => !monthDay.available)
      .map(monthDay => {
        return new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth(),
          monthDay.day,
        );
      });
  }, [currentMonth, monthAvailability]);

  const selectedDateString = useMemo(() => {
    return format(selectedDate, "'dia' dd 'de' MMMM", { locale: ptBR });
  }, [selectedDate]);

  const dayOfTheWeekString = useMemo(() => {
    return format(selectedDate, 'cccc', { locale: ptBR });
  }, [selectedDate]);

  const morningAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      return parseISO(appointment.date).getHours() < 12;
    });
  }, [appointments]);

  const afternoonAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      return parseISO(appointment.date).getHours() >= 12;
    });
  }, [appointments]);

  const nextAppointment = useMemo(() => {
    return appointments.find(appointment => {
      return isAfter(parseISO(appointment.date), new Date());
    });
  }, [appointments]);

  useEffect(() => {
    api
      .get<IMonthAvailabilityItem[]>(
        `/providers/${user.id}/month-availability`,
        {
          params: {
            year: currentMonth.getFullYear(),
            month: currentMonth.getMonth() + 1,
          },
        },
      )
      .then(response => setMonthAvailability(response.data));
  }, [currentMonth, user.id]);

  useEffect(() => {
    api
      .get<IAppointment[]>(`/appointments/me`, {
        params: {
          day: selectedDate.getDate(),
          year: currentMonth.getFullYear(),
          month: currentMonth.getMonth() + 1,
        },
      })
      .then(response => {
        const formattedAppointments = response.data.map(appointment => {
          return {
            ...appointment,
            formattedHour: format(parseISO(appointment.date), 'HH:mm'),
          };
        });

        setAppointments(formattedAppointments);
      });
  }, [selectedDate, currentMonth]);

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if (modifiers.available && !modifiers.disabled) {
      setSelectedDate(day);
    }
  }, []);

  const handleMonthChange = useCallback((month: Date) => {
    setCurrentMonth(month);
  }, []);

  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logo} alt="GoBarber" />
          <Profile>
            <img src={user.avatar_url} alt={user.name} />
            <div>
              <span>Bem vindo,</span>
              <Link to="/profile">
                <strong>{user.name}</strong>
              </Link>
            </div>
          </Profile>
          <button onClick={signOut} type="button">
            <FiPower />
          </button>
        </HeaderContent>
      </Header>
      <Content>
        <Schedule>
          <h1>Horários agendados</h1>
          <p>
            {isToday(selectedDate) && <span>hoje</span>}
            <span>{selectedDateString}</span>
            <span>{dayOfTheWeekString}</span>
          </p>
          {isToday(selectedDate) && nextAppointment && (
            <NextAppointment>
              <strong>Agendamento a seguir</strong>
              <div>
                <img
                  src={nextAppointment.user.avatar_url}
                  alt={nextAppointment.user.name}
                />
                <strong>{nextAppointment.user.name}</strong>
                <span>
                  <FiClock />
                  {nextAppointment.formattedHour}
                </span>
              </div>
            </NextAppointment>
          )}
          <Section>
            <strong>Manhã</strong>
            {morningAppointments.map(appointment => (
              <Appointment key={appointment.id}>
                <span>
                  <FiClock />
                  {appointment.formattedHour}
                </span>
                <div>
                  <img
                    src={appointment.user.avatar_url}
                    alt={appointment.user.name}
                  />
                  <strong>{appointment.user.name}</strong>
                </div>
              </Appointment>
            ))}
            {morningAppointments.length === 0 && (
              <p>nenhum agendamento neste período</p>
            )}
          </Section>
          <Section>
            <strong>Tarde</strong>
            {afternoonAppointments.map(appointment => (
              <Appointment key={appointment.id}>
                <span>
                  <FiClock />
                  {appointment.formattedHour}
                </span>
                <div>
                  <img
                    src={appointment.user.avatar_url}
                    alt={appointment.user.name}
                  />
                  <strong>{appointment.user.name}</strong>
                </div>
              </Appointment>
            ))}
            {afternoonAppointments.length === 0 && (
              <p>nenhum agendamento neste período</p>
            )}
          </Section>
        </Schedule>
        <Calendar>
          <DayPicker
            weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
            fromMonth={new Date()}
            disabledDays={[
              {
                daysOfWeek: [0, 6],
              },
              ...disabledDays,
            ]}
            modifiers={{
              available: { daysOfWeek: [1, 2, 3, 4, 5] },
            }}
            selectedDays={selectedDate}
            onDayClick={handleDateChange}
            onMonthChange={handleMonthChange}
            months={[
              'Janeiro',
              'Fevereiro',
              'Março',
              'Abril',
              'Maio',
              'Junho',
              'Julho',
              'Agosto',
              'Setembro',
              'Outubro',
              'Novembro',
              'Dezembro',
            ]}
          />
        </Calendar>
      </Content>
    </Container>
  );
};

export default Dashboard;
