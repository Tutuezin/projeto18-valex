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

dotenv.config();

export async function createCard(
  employeeId: number,
  type: string,
  apiKey: string
) {
  //BUSINESS RULES
  const apiKeyExists = await companyRepository.findByApiKey(apiKey);
  if (!apiKeyExists) throw notFoundError("company");

  const employeeExists = await employeeRepository.findById(employeeId);
  if (!employeeExists) throw notFoundError("employee");

  const employeeCardType = await cardRepository.findByTypeAndEmployeeId(
    type,
    employeeId
  );
  if (employeeCardType) throw conflictError(type);

  //CARD INFOS
  const Cryptr = require("cryptr");
  const cryptr = new Cryptr(process.env.CRYPTR_SECRET_KEY);

  const cardNumber = faker.finance.creditCardNumber("#### #### #### ####");
  const employeeFullName = employeeExists.fullName;
  const expirationDate = dayjs().add(5, "years").format("MM/YY");
  const cardCVC = cryptr.encrypt(faker.finance.creditCardCVV());

  const cardHolderName = cardUtils.generateCardName(employeeFullName);

  const cardInfos = {
    employeeId,
    number: cardNumber,
    cardholderName: cardHolderName,
    securityCode: cardCVC,
    expirationDate,
    isVirtual: false,
    isBlocked: false,
    type,
  };

  await cardRepository.insert(cardInfos);
}

export async function activateCard(
  cardId: number,
  securityCode: string,
  password: string
) {
  //BUSINESS RULES
  const cardExists = await cardRepository.findById(cardId);
  if (!cardExists) throw notFoundError("card");

  const currentDay = dayjs().format("MM/YY");
  if (currentDay > cardExists.expirationDate)
    throw accessDeniedError("activate card");

  if (cardExists.password) throw accessDeniedError("activate card");

  const Cryptr = require("cryptr");
  const cryptr = new Cryptr(process.env.CRYPTR_SECRET_KEY);
  const decryptedCardCVC = cryptr.decrypt(cardExists.securityCode);
  console.log(decryptedCardCVC);

  if (decryptedCardCVC !== securityCode)
    throw unauthorizedError("Security code");

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  //const verifyPassword = bcrypt.compareSync(password, hashedPassword);

  await cardRepository.update(cardId, { password: hashedPassword });
}
