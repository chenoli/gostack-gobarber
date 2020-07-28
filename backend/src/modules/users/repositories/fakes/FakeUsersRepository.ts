import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import User from '@modules/users/infra/typeorm/entities/User';
import { uuid } from 'uuidv4';
import IFindProvidersDTO from '@modules/users/dtos/IFindProvidersDTO';

class FakeUsersRepository implements IUsersRepository {
  private users: User[] = [];

  public async findById(id: string): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email);
  }

  public async findProviders({
    except_user_id,
  }: IFindProvidersDTO): Promise<User[]> {
    let { users } = this;

    if (except_user_id) {
      users = this.users.filter(user => user.id !== except_user_id);
    }

    return users;
  }

  public async create(data: ICreateUserDTO): Promise<User> {
    const user = new User();
    Object.assign(user, { id: uuid() }, data);
    this.users.push(user);
    return user;
  }

  public async save(user: User): Promise<User> {
    const index = this.users.findIndex(u => u.id === user.id);
    this.users[index] = user;
    return user;
  }
}

export default FakeUsersRepository;
