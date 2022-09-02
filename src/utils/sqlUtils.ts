export function mapObjectToUpdateQuery({
  object,
  offset = 1,
}: {
  object: {};
  offset: number;
}) {
  const objectColumns = Object.keys(object)
    .map((key, index) => `"${key}"=$${index + offset}`)
    .join(",");
  const objectValues = Object.values(object);

  return { objectColumns, objectValues };
}
