export const CLIENT_FIELDS = ["firstName", "lastName", "email", "phone", "company", "taxId", "address", "city", "state", "postalCode", "country", "notes"];
export function validateClient(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("Los datos del cliente no son válidos.");
  const result = {};
  for (const key of CLIENT_FIELDS) {
    const value = input[key] ?? "";
    if (typeof value !== "string" || value.length > (key === "notes" ? 2000 : 500)) throw new Error(`Revisa el campo ${key}.`);
    result[key] = value.trim();
  }
  if (!result.firstName && !result.lastName && !result.company) throw new Error("Indica nombre o empresa.");
  if (result.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result.email)) throw new Error("El correo electrónico no es válido.");
  result.email = result.email.toLowerCase();
  return result;
}
