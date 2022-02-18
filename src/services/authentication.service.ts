import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bCrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as jwksClient from 'jwks-rsa';
import { v4 as uuid } from 'uuid';
import { LoginDTO } from '../dto/login.dto';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../models/user.model';
import config from '../config';
import { SwaIdToken } from '../dto/swa-id-token.dto';
import { SwaDTO } from '../dto/swa.dto';
import { ActivationDTO } from '../dto/activation.dto';

@Injectable()
export class AuthenticationService {
  constructor(private readonly userRepository: UserRepository) {}

  registerUser = async (mail: string): Promise<User> => {
    const existingUser = await this.findUserByMail(mail);

    if (!!existingUser) {
      throw new BadRequestException();
    }

    const activationCode = uuid();

    const user = await this.userRepository.insert({ mail, activationCode });

    return this.userRepository.findOneById(user._id);
  };

  activateUser = async (parameters: ActivationDTO): Promise<User> => {
    const user = await this.userRepository.findOneBy({
      activationCode: parameters.code,
    });

    if (!!user) {
      throw new BadRequestException();
    }

    user.firstname = parameters.firstname;
    user.lastname = parameters.lastname;
    user.activationCode = undefined;

    return user.save();
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

  findUserByMail = (mail: string): Promise<User> =>
    this.userRepository.findOneBy({ mail });

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
