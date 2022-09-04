import {
  notFoundError,
  conflictError,
  accessDeniedError,
  unauthorizedError,
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
