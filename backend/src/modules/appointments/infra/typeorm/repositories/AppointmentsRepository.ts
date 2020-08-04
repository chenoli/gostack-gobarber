import { getRepository, Repository, Raw } from 'typeorm';

import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import IFindAllInMonthByProviderDTO from '@modules/appointments/dtos/IFindAllInMonthByProviderDTO';

import IFindAllInDayByProviderDTO from '@modules/appointments/dtos/IFindAllInDayByProviderDTO';
import Appointment from '../entities/Appointment';

class AppointmentsRepository implements IAppointmentsRepository {
  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  public async create({
    date,
    user_id,
    provider_id,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create({
      date,
      user_id,
      provider_id,
    });

    await this.ormRepository.save(appointment);

    return appointment;
  }

  public async findByDate(
    provider_id: string,
    date: Date,
  ): Promise<Appointment | undefined> {
    const foundAppointment = await this.ormRepository.findOne({
      where: {
        date,
        provider_id,
      },
    });

    return foundAppointment;
  }

  public async findAllInMonthByProvider({
    year,
    month,
    provider_id,
  }: IFindAllInMonthByProviderDTO): Promise<Appointment[]> {
    const formattedMonth = String(month).padStart(2, '0');

    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'MM-YYYY') = '${formattedMonth}-${year}'`,
        ),
      },
    });

    return appointments;
  }

  public async findAllInDayByProvider({
    day,
    year,
    month,
    provider_id,
  }: IFindAllInDayByProviderDTO): Promise<Appointment[]> {
    const formattedMonth = String(month).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');

    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${formattedDay}-${formattedMonth}-${year}'`,
        ),
      },
      relations: ['user'],
    });

    return appointments;
  }
}

export default AppointmentsRepository;
