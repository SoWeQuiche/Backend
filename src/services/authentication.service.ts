import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bCrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { LoginDTO } from '../data-transfer-objects/loginDTO';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../models/user.model';
import config from '../config';

@Injectable()
export class AuthenticationService {
  constructor(private readonly userRepository: UserRepository) {}

  login = async (parameters: LoginDTO) => {
    const user = await this.userRepository.findOneBy(
      { mail: parameters.mail },
      { hiddenPropertiesToSelect: ['password'] },
    );

    const passwordIsCorrect = await this.comparePassword({
      password1: parameters.password,
      password2: user?.password ?? '',
    });

    if (!passwordIsCorrect) {
      throw new UnauthorizedException();
    }

    return { token: this.createToken(user) };
  };

  private createToken = (user: User): string =>
    jwt.sign({ _id: user._id }, config.jwt.secretKey, {
      expiresIn: config.jwt.tokenExpirationTime,
    });

  private comparePassword = async ({
    password1,
    password2,
  }): Promise<boolean> => bCrypt.compare(password1, password2);

  private encryptPassword = async (password: string): Promise<string> =>
    bCrypt.hash(password, 15);
}
