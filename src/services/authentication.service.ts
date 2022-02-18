import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bCrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as jwksClient from 'jwks-rsa';
import { LoginDTO } from '../dto/login.dto';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../models/user.model';
import config from '../config';
import { RegisterDTO } from '../dto/register.dto';
import { SwaIdToken } from '../dto/swa-id-token.dto';
import { SwaDTO } from '../dto/swa.dto';

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

  login = async (parameters: LoginDTO): Promise<{ token: string }> => {
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

  loginWithApple = async (parameters: SwaDTO): Promise<{ token: string }> => {
    const decodedToken = await this.verifyAppleToken(
      parameters.authorization.id_token,
    );

    const existingUser = await this.userRepository.findOneBy({
      mail: decodedToken.email,
    });

    if (existingUser) {
      return { token: this.createToken(existingUser) };
    }

    const user = await this.userRepository.insert({
      mail: decodedToken.email,
      firstname: parameters.user.name.firstName,
      lastname: parameters.user.name.lastName,
    });

    return { token: this.createToken(user) };
  };

  private createToken = (user: User): string =>
    jwt.sign({ _id: user._id }, config.jwt.secretKey, {
      expiresIn: config.jwt.expirationTime,
    });

  private comparePassword = async ({
    password1,
    password2,
  }): Promise<boolean> => bCrypt.compare(password1, password2);

  private encryptPassword = async (password: string): Promise<string> =>
    bCrypt.hash(password, 15);

  private verifyAppToken = async (token: string): Promise<{ _id: string }> =>
    new Promise((resolve, reject) => {
      jwt.verify(token, config.jwt.secretKey, async (err, decoded) => {
        if (err || !decoded) {
          reject(new UnauthorizedException());

          return;
        }

        resolve(decoded);
      });
    });

  private getAppleJwtSigningKey = (header, callback) => {
    const client = jwksClient({
      jwksUri: 'https://appleid.apple.com/auth/keys',
    });

    client.getSigningKey(header.kid, function (err, key: any) {
      const signingKey = key.publicKey || key.rsaPublicKey;

      callback(null, signingKey);
    });
  };

  private verifyAppleToken = async (token: string): Promise<SwaIdToken> =>
    new Promise((resolve, reject) => {
      jwt.verify(token, this.getAppleJwtSigningKey, async (err, decoded) => {
        if (err || !decoded) {
          reject(new UnauthorizedException());

          return;
        }

        resolve(decoded);
      });
    });

  verifyUserToken = async (bearerToken: string): Promise<User> => {
    const decodedToken = await this.verifyAppToken(bearerToken);

    const user = await this.userRepository.findOneById(decodedToken._id);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  };
}

const test = {
  authorization: {
    code: 'c53ffeda9250a4b3a892f6bc70539f9cc.0.rrxsx.JdNfCDupal3CjNDgYgK4eQ',
    id_token:
      'eyJraWQiOiJZdXlYb1kiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FwcGxlaWQuYXBwbGUuY29tIiwiYXVkIjoiY29tLm1heGVuY2Vtb3R0YXJkLnN3cS5zd2EiLCJleHAiOjE2NDUyNjA4MzksImlhdCI6MTY0NTE3NDQzOSwic3ViIjoiMDAxNzI3LmI1OTQzYTExMDlkNjQ0NTk4ZjBlZWEwM2QzZTYxNmJiLjEzNTciLCJjX2hhc2giOiJObW9CZVo0Vm1zWFoyVEd6bjlTSUdnIiwiZW1haWwiOiI0czkya2Zia3ZnQHByaXZhdGVyZWxheS5hcHBsZWlkLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjoidHJ1ZSIsImlzX3ByaXZhdGVfZW1haWwiOiJ0cnVlIiwiYXV0aF90aW1lIjoxNjQ1MTc0NDM5LCJub25jZV9zdXBwb3J0ZWQiOnRydWV9.EEMgrlxMqcH0ftNXXNZqZWUKMe6U4agnZKO1hmqyV2jvydhO8N5lQ-ARS5Gp24kAkfu9E4VQiehjTsQi9uKoIUas0-QqWdvV7POMEEkyvMW7a_HA7Ar5IWA6i4BRqqlLvst2Day4zBfgY_VYj4bbvEd4tQW-bbcLySd6BJtBQBvw_euTer-emTGgUDCgWLl0fVDvJI2Covf7ZV2hYyX7QtZwhIp26hn0VBMqu2bIzLCbBxMfUAkLyyq2WCfamm7ju3DB9Q6D8gKrH3n7m0tcf_aaGjurzZQaAxZkdSWqiUR-ghgDPK91Mry2UC6R8f3cOOqYEHiVOkaaA6kL03S5jA',
  },
  user: {
    name: { firstName: 'Guillaume', lastName: 'Chateauroux' },
    email: '4s92kfbkvg@privaterelay.appleid.com',
  },
};
