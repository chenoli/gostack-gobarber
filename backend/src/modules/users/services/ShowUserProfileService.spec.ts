import AppError from '@shared/errors/AppError';
import ShowUserProfileService from './ShowUserProfileService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

let fakeUsersRepository: FakeUsersRepository;
let showUserProfileService: ShowUserProfileService;

describe('ShowUserProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    showUserProfileService = new ShowUserProfileService(fakeUsersRepository);
  });

  it('should be able to show profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const profile = await showUserProfileService.execute({ user_id: user.id });

    expect(profile.name).toBe('John Doe');
    expect(profile.email).toBe('johndoe@example.com');
  });

  it('should not be able to show profile from invalid user', async () => {
    await expect(
      showUserProfileService.execute({ user_id: 'invalid-user' }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
