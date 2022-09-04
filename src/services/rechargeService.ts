import * as cardRepository from "../repositories/cardRepository";
import * as companyRepository from "../repositories/companyRepository";
import * as rechargeRepository from "../repositories/rechargeRepository";
import * as cardUtils from "../utils/cardUtils";
import dayjs from "dayjs";

export async function rechargeCard(
  apiKey: string,
  cardId: number,
  amount: number
) {
  const apiKeyExists = await companyRepository.findByApiKey(apiKey);
  const cardExists: any = await cardRepository.findById(cardId);
  const currentDay = dayjs().format("MM/YY");

  cardUtils.validateRechargeCard(apiKeyExists, cardExists, currentDay);

  rechargeRepository.insert({ cardId, amount });
}
