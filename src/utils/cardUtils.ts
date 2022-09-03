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
