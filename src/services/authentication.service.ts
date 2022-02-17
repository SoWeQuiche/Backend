import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bCrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { LoginDTO } from '../dto/login.dto';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../models/user.model';
import config from '../config';
import { RegisterDTO } from 'src/dto/register.dto';

@Injectable()
export class AuthenticationService {
  constructor(private readonly userRepository: UserRepository) {}

  registerUser = async (parameters: RegisterDTO): Promise<User> => {
    const existingUser = await this.userRepository.findOneBy({
      mail: parameters.mail,
    });

    if (!!existingUser) {
      throw new BadRequestException();
    }

    // const activationKey = this.authenticationService.createActivationKey();

    const password = await this.encryptPassword(parameters.password);

    const user = await this.userRepository.insert({
      ...parameters,
      password,
    });

    return this.userRepository.findOneById(user._id);
  };

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

  verifyUserToken = (bearerToken: string): Promise<User> =>
    new Promise((resolve, reject) => {
      jwt.verify(bearerToken, config.jwt.secretKey, async (err, decoded) => {
        if (err || !decoded) {
          reject(new UnauthorizedException());

          return;
        }

        const user = await this.userRepository.findOneById(decoded._id);

        if (!user) {
          reject(new UnauthorizedException());

          return;
        }

        resolve(user);
      });
    });
}
