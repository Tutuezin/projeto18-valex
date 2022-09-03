import * as cardRepository from "../repositories/cardRepository";
import * as companyRepository from "../repositories/companyRepository";
import * as employeeRepository from "../repositories/employeeRepository";
import { notFoundError, conflictError } from "../middlewares/errorMiddleware";
import { faker } from "@faker-js/faker";
import dotenv from "dotenv";
import dayjs from "dayjs";

dotenv.config();

export async function createCard(
  employeeId: number,
  type: string,
  apiKey: string
) {
  const apiKeyExists = await companyRepository.findByApiKey(apiKey);
  if (!apiKeyExists) throw notFoundError("company");

  const employeeExists = await employeeRepository.findById(employeeId);
  if (!employeeExists) throw notFoundError("employee");

  const employeeCardType = await cardRepository.findByTypeAndEmployeeId(
    type,
    employeeId
  );
  if (employeeCardType) throw conflictError(type);

  const Cryptr = require("cryptr");
  const cryptr = new Cryptr(process.env.CRYPTR_SECRET_KEY);

  const cardNumber = faker.finance.creditCardNumber("#### #### #### ####");
  const cardHolderName = employeeExists.fullName;
  const expirationDate = dayjs().add(5, "years").format("MM/YY");
  const cardCVC = cryptr.encrypt(faker.finance.creditCardCVV());

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
