import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { Token, TokenContext } from "./token.schema";
import * as randomToken from "rand-token";
import * as dayjs from "dayjs";
import { User, UserDocument } from "../users/user.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { getObjectId } from "../../shared/mongoose";

@Injectable()
export class TokensService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  private readonly logger = new Logger("Tokens");

  async generateToken(options: {
    userId: string;
    length?: number;
    expiresAt?: Date;
    context?: TokenContext;
    consumed?: false | null | undefined;
  }) {
    const length = options.length || 16;
    return this.userModel
      .findOne(
        {
          _id: options.userId,
        },
        {
          tokens: {
            $elemMatch: {
              context: options.context,
              consumed: false,
            },
          },
        }
      )
      .orFail(() => {
        throw new Error("User not found");
      })
      .exec()
      .then((user) => {
        if (user) {
          this.logger.verbose(
            `[${options.context}] Valid token already exists for user ${options.userId}, regenerating...`
          );
          const token = user.tokens.find(
            (token) => token.context === options.context && !token.consumed
          );
          const value = randomToken.generate(length);
          return this.userModel
            .updateOne(
              {
                _id: options.userId,
                "tokens.value": token.value,
                consumed: false,
              },
              {
                "tokens.$.value": value,
              }
            )
            .exec()
            .then(() => ({
              ...token,
              value,
            }));
        }
      })
      .catch(() => {
        this.logger.verbose(
          `[${options.context}] Generating new token for user ${options.userId}`
        );

        const token: Token = {
          value: randomToken.generate(length),
          expiresAt: options.expiresAt || null,
          length,
          context: options.context || null,
          consumed: options.consumed === undefined ? false : options.consumed,
        };

        return this.userModel
          .findByIdAndUpdate(getObjectId(options.userId), {
            $push: { tokens: token },
          })
          .exec()
          .then(() => token);
      })
      .then((token) => {
        this.logger.verbose(
          `Generated token ${JSON.stringify(
            this.getReadableToken(token, options.userId)
          )}`
        );
        return token;
      });
  }

  async consumeToken(userId: string, token: Token): Promise<any> {
    const readableToken = JSON.stringify(this.getReadableToken(token, userId));
    if (token.consumed === null) {
      this.logger.verbose(`Token used, not consumed ${readableToken}`);
      return;
    }

    return this.userModel
      .updateOne(
        { _id: getObjectId(userId), "tokens.value": token.value },
        {
          "tokens.$.consumed": true,
        }
      )
      .exec()
      .then((token) => {
        this.logger.verbose(`Token used, consumed ${readableToken}`);
        return token;
      });
  }

  getReadableToken(token: Token, userId: string) {
    return {
      user: getObjectId(userId),
      value: token.value,
      context: token.context || "No context (restricted)",
      consumed:
        token.consumed === null
          ? "Infinite use"
          : token.consumed
          ? "Yes"
          : "No",
      expiration: token.expiresAt
        ? dayjs(token.expiresAt).format("YYYY-MM-DD HH:mm:ss")
        : "Never",
    };
  }

  async validateToken(
    userId: Types.ObjectId,
    value: string,
    context?: TokenContext
  ) {
    try {
      const user = await this.userModel
        .findOne({
          _id: userId.toString(),
          tokens: { $elemMatch: { value, context, consumed: false } },
        })
        .orFail(() => {
          throw new Error("Token not found");
        })
        .exec();

      const token = user.tokens.find(
        (token) =>
          token.value === value && token.context === context && !token.consumed
      );

      if (token.expiresAt && dayjs(token.expiresAt).isBefore(dayjs())) {
        throw new Error("Token expired");
      }

      return token;
    } catch (e) {
      throw new HttpException(
        `Invalid token - ${e.message}`,
        HttpStatus.FORBIDDEN
      );
    }
  }
}
