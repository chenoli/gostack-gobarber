import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailabilityService: ListProviderMonthAvailabilityService;

describe('ListProviderMonthAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderMonthAvailabilityService = new ListProviderMonthAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the month availability of a provider', async () => {
    await fakeAppointmentsRepository.create({
      user_id: 'user',
      provider_id: 'provider',
      date: new Date(2020, 6, 23, 8, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      user_id: 'user',
      provider_id: 'provider',
      date: new Date(2020, 6, 23, 9, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      user_id: 'user',
      provider_id: 'provider',
      date: new Date(2020, 6, 23, 10, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      user_id: 'user',
      provider_id: 'provider',
      date: new Date(2020, 6, 23, 11, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      user_id: 'user',
      provider_id: 'provider',
      date: new Date(2020, 6, 23, 12, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      user_id: 'user',
      provider_id: 'provider',
      date: new Date(2020, 6, 23, 13, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      user_id: 'user',
      provider_id: 'provider',
      date: new Date(2020, 6, 23, 14, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      user_id: 'user',
      provider_id: 'provider',
      date: new Date(2020, 6, 23, 15, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      user_id: 'user',
      provider_id: 'provider',
      date: new Date(2020, 6, 23, 16, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      user_id: 'user',
      provider_id: 'provider',
      date: new Date(2020, 6, 23, 17, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      user_id: 'user',
      provider_id: 'provider',
      date: new Date(2020, 6, 24, 10, 0, 0),
    });

    const availability = await listProviderMonthAvailabilityService.execute({
      year: 2020,
      month: 7,
      provider_id: 'provider',
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        {
          day: 22,
          available: true,
        },
        {
          day: 23,
          available: false,
        },
        {
          day: 24,
          available: true,
        },
        {
          day: 25,
          available: true,
        },
      ]),
    );
  });
});
