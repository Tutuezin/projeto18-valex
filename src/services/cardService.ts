import * as cardRepository from "../repositories/cardRepository";
import * as companyRepository from "../repositories/companyRepository";
import * as employeeRepository from "../repositories/employeeRepository";
import * as paymentRepository from "../repositories/paymentRepository";
import * as rechargeRepository from "../repositories/rechargeRepository";
import * as cardUtils from "../utils/cardUtils";

import { faker } from "@faker-js/faker";
import dotenv from "dotenv";
import dayjs from "dayjs";
import bcrypt from "bcrypt";
import {
  unauthorizedError,
  badRequestError,
} from "../middlewares/errorMiddleware";

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

  await cardRepository.update(cardId, { password: hashedPassword });
}

export async function balanceCard(cardId: number) {
  const cardExists = await cardRepository.findById(cardId);

  cardUtils.validateBalanceCard(cardExists);

  const transactions = await paymentRepository.findByCardId(cardId);
  console.log(transactions);
  const recharge = await rechargeRepository.findByCardId(cardId);
  console.log(recharge);
}

export async function blockCard(cardId: number, password: string) {
  const cardExists: any = await cardRepository.findById(cardId);
  const currentDay = dayjs().format("MM/YY");
  cardUtils.validateBlockCard(cardExists, currentDay);

  const isBlocked = cardExists.isBlocked;
  if (isBlocked) throw badRequestError("block");

  const verifyPassword = bcrypt.compareSync(password, cardExists.password);
  if (!verifyPassword) throw unauthorizedError("Password");

  await cardRepository.update(cardId, { isBlocked: true });
}

export async function unblockCard(cardId: number, password: string) {
  const cardExists: any = await cardRepository.findById(cardId);
  const currentDay = dayjs().format("MM/YY");
  cardUtils.validateUnblockCard(cardExists, currentDay);

  const isBlocked = cardExists.isBlocked;
  if (!isBlocked) throw badRequestError("unblock");

  const verifyPassword = bcrypt.compareSync(password, cardExists.password);
  if (!verifyPassword) throw unauthorizedError("Password");

  await cardRepository.update(cardId, { isBlocked: false });
}
