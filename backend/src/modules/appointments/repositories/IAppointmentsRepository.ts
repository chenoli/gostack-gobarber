import Appointment from '../infra/typeorm/entities/Appointment';
import ICreateAppointmentDTO from '../dtos/ICreateAppointmentDTO';
import IFindAllInMonthByProviderDTO from '../dtos/IFindAllInMonthByProviderDTO';
import IFindAllInDayByProviderDTO from '../dtos/IFindAllInDayByProviderDTO';

export default interface IAppointmentsRepository {
  create(data: ICreateAppointmentDTO): Promise<Appointment>;
  findByDate(date: Date): Promise<Appointment | undefined>;
  findAllInMonthByProvider(
    data: IFindAllInMonthByProviderDTO,
  ): Promise<Appointment[]>;
  findAllInDayByProvider(
    data: IFindAllInDayByProviderDTO,
  ): Promise<Appointment[]>;
}
