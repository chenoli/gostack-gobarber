import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
  name: string;
  email: string;
  user_id: string;
  password?: string;
  old_password?: string;
}

@injectable()
export default class UpdateUserProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    name,
    email,
    user_id,
    password,
    old_password,
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found!');
    }

    const userWithNewEmail = await this.usersRepository.findByEmail(email);

    if (userWithNewEmail && userWithNewEmail.id !== user_id) {
      throw new AppError('This email is already in use!');
    }

    user.name = name;
    user.email = email;

    if (password && !old_password) {
      throw new AppError('You need to inform the old password!');
    }

    if (password && old_password) {
      if (!(await this.hashProvider.compare(old_password, user.password))) {
        throw new AppError('Old password is invalid!');
      }

      user.password = await this.hashProvider.generate(password);
    }

    return this.usersRepository.save(user);
  }
}
