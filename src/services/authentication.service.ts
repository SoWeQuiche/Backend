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
    const decodedToken = await this.verifyAppleToken(parameters.id_token);

    const existingUser = await this.userRepository.findOneBy({
      mail: decodedToken.email,
    });

    if (existingUser) {
      return { token: this.createToken(existingUser) };
    }

    const user = await this.userRepository.insert({
      mail: decodedToken.email,
      firstname: parameters.firstname,
      lastname: parameters.lastname,
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

  // private appleIdClientSecret = (): string =>
  //   jwt.sign(
  //     {
  //       iss: config.swa.teamId,
  //       iat: Date.now(),
  //       exp: Date.now() + config.jwt.expirationTime,
  //       aud: 'https://appleid.apple.com',
  //       sub: config.swa.serviceId,
  //     },
  //     config.swa.certKey,
  //     {
  //       keyid: config.swa.keyId,
  //       algorithm: 'ES256',
  //     },
  //   );

  // private refreshAppleToken = async (tokenCode: string): Promise<string> =>
  //   await axios.post('https://appleid.apple.com/auth/token', {
  //     client_id: config.swa.serviceId,
  //     client_secret: this.appleIdClientSecret(),
  //     code: tokenCode,
  //     grant_type: 'authorization_code',
  //     redirect_uri: 'https://api.sign.quiches.ovh/auth/test',
  //   });
}
