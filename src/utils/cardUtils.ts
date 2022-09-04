import {
  notFoundError,
  conflictError,
  accessDeniedError,
  unauthorizedError,
  notAcceptableError,
} from "../middlewares/errorMiddleware";

export function generateCardName(fullName: string): string {
  const [firstName, ...rest] = fullName.split(" ");
  const lastName = rest.pop();

  let middleName = rest
    .filter((name) => name.length > 3)
    .map((firstLetter) => firstLetter[0]);

  const finalName: string = [firstName, ...middleName, lastName]
    .join(" ")
    .toUpperCase();

  return finalName;
}

export function generateBalance(recharges: any, payments: any) {
  let balancePositive = 0;
  recharges.forEach((recharge: any) => (balancePositive += recharge.amount));

  let balanceNegative = 0;
  payments.forEach((payment: any) => (balanceNegative += payment.amount));

  const balance = balancePositive - balanceNegative;

  return balance;
}

export function validateCreateCard(
  type: string,
  apiKeyExists: any,
  employeeExists: any,
  employeeCardType: any
) {
  if (!apiKeyExists) throw notFoundError("company");
  if (!employeeExists) throw notFoundError("employee");
  if (employeeCardType) throw conflictError(type);
}

export function validateActivateCard(
  cardExists: any,
  currentDay: string,
  decryptedCardCVC: string,
  securityCode: string
) {
  if (!cardExists) throw notFoundError("card");
  if (currentDay > cardExists.expirationDate)
    throw accessDeniedError("activate card");
  if (cardExists.password) throw accessDeniedError("activate card");
  if (decryptedCardCVC !== securityCode)
    throw unauthorizedError("Security code");
}

export function validateBalanceCard(cardExists: any) {
  if (!cardExists) throw notFoundError("card");
}

export function validateBlockCard(cardExists: any, currentDay: string) {
  if (!cardExists) throw notFoundError("card");
  if (currentDay > cardExists.expirationDate)
    throw accessDeniedError("block card");
  if (!cardExists.password) throw accessDeniedError("block card");
}
export function validateUnblockCard(cardExists: any, currentDay: string) {
  if (!cardExists) throw notFoundError("card");
  if (currentDay > cardExists.expirationDate)
    throw accessDeniedError("unblock card");
  if (!cardExists.password) throw accessDeniedError("unblock card");
}

export function validateRechargeCard(
  apiKeyExists: any,
  cardExists: any,
  currentDay: string
) {
  if (!apiKeyExists) throw notFoundError("company");
  if (!cardExists) throw notFoundError("card");
  if (!cardExists.password) throw accessDeniedError("recharge card");
  if (currentDay > cardExists.expirationDate)
    throw accessDeniedError("recharge card");
}

export function validatePayment(
  cardExists: any,
  currentDay: string,
  businessExists: any
) {
  if (!cardExists) throw notFoundError("card");
  if (currentDay > cardExists.expirationDate)
    throw accessDeniedError("release payment");
  if (!cardExists.password) throw accessDeniedError("release payment");
  if (!businessExists) throw notFoundError("businesss");
  if (cardExists.type !== businessExists.type)
    throw notAcceptableError("type card is not the same business type!");
}

export function validateEnoughBalance(balance: number, amount: number) {
  if (amount > balance)
    throw notAcceptableError("amount is greater than the balance!");
}
