let fullName = "Vyctao da Pica de Rola Pinto";
const [firstName, ...rest] = fullName.split(" ");
const lastName = rest.pop();

let middleName = rest
  .filter((name) => name.length > 3)
  .map((firstLetter) => firstLetter[0]);

const finalName = [firstName, ...middleName, lastName].join(" ").toUpperCase();

console.log(finalName);
