import * as cardRepository from "../repositories/cardRepository";
import * as companyRepository from "../repositories/companyRepository";
import * as employeeRepository from "../repositories/employeeRepository";
import * as cardUtils from "../utils/cardUtils";
import {
  notFoundError,
  conflictError,
  accessDeniedError,
  unauthorizedError,
} from "../middlewares/errorMiddleware";
import { faker } from "@faker-js/faker";
import dotenv from "dotenv";
import dayjs from "dayjs";
import bcrypt from "bcrypt";
import { string } from "joi";

dotenv.config();

export async function createCard(
  employeeId: number,
  type: string,
  apiKey: string
) {
  //BUSINESS RULES
  const apiKeyExists = await companyRepository.findByApiKey(apiKey);
  const employeeExists = await employeeRepository.findById(employeeId);
  const employeeCardType = await cardRepository.findByTypeAndEmployeeId(
    type,
    employeeId
  );
  cardUtils.validateCreateCard(
    type,
    apiKeyExists,
    employeeExists,
    employeeCardType
  );

  //CARD INFOS
  const Cryptr = require("cryptr");
  const cryptr = new Cryptr(process.env.CRYPTR_SECRET_KEY);

  const cardNumber = faker.finance.creditCardNumber("#### #### #### ####");
  const employeeFullName = employeeExists.fullName;
  const expirationDate = dayjs().add(5, "years").format("MM/YY");
  const cardCVC = faker.finance.creditCardCVV();
  const hashedCardCVC = cryptr.encrypt(cardCVC);
  const cardHolderName = cardUtils.generateCardName(employeeFullName);

  const cardInfos = {
    employeeId,
    number: cardNumber,
    cardholderName: cardHolderName,
    securityCode: hashedCardCVC,
    expirationDate,
    isVirtual: false,
    isBlocked: false,
    type,
  };

  await cardRepository.insert(cardInfos);

  return cardCVC;
}

export async function activateCard(
  cardId: number,
  securityCode: string,
  password: string
) {
  //BUSINESS RULES
  const cardExists = await cardRepository.findById(cardId);
  const currentDay = dayjs().format("MM/YY");
  const Cryptr = require("cryptr");
  const cryptr = new Cryptr(process.env.CRYPTR_SECRET_KEY);
  const decryptedCardCVC = cryptr.decrypt(cardExists.securityCode);

  cardUtils.validateActivateCard(
    cardExists,
    currentDay,
    decryptedCardCVC,
    securityCode
  );

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  //const verifyPassword = bcrypt.compareSync(password, hashedPassword);

  await cardRepository.update(cardId, { password: hashedPassword });
}
