import * as cardRepository from "../repositories/cardRepository";
import * as businessRepository from "../repositories/businessRepository";
import * as cardUtils from "../utils/cardUtils";
import * as paymentRepository from "../repositories/paymentRepository";
import * as rechargeRepository from "../repositories/rechargeRepository";
import bcrypt from "bcrypt";
import {
  accessDeniedError,
  unauthorizedError,
} from "../middlewares/errorMiddleware";
import dayjs from "dayjs";

export async function payment(
  cardId: number,
  businessId: number,
  password: string,
  amount: number
) {
  const cardExists: any = await cardRepository.findById(cardId);
  const currentDay = dayjs().format("MM/YY");
  const businessExists = await businessRepository.findById(businessId);

  cardUtils.validatePayment(cardExists, currentDay, businessExists);

  const isBlocked = cardExists.isBlocked;
  if (isBlocked) throw accessDeniedError("payment");

  const verifyPassword = bcrypt.compareSync(password, cardExists.password);
  if (!verifyPassword) throw unauthorizedError("Password");

  const recharges = await rechargeRepository.findByCardId(cardId);
  const payments = await paymentRepository.findByCardId(cardId);

  const balance = cardUtils.generateBalance(recharges, payments);

  cardUtils.validateEnoughBalance(balance, amount);

  const paymentData = {
    cardId,
    businessId,
    amount,
  };

  paymentRepository.insert(paymentData);
}
