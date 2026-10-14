import test from "node:test";
import assert from "node:assert/strict";
import { validateClient } from "../lib/admin-clients.mjs";
test("client data preserves phone, postal code and tax ID as text", () => {
  const value = validateClient({ firstName: " Ana ", email: "ANA@example.com", phone: "+52 5512345678", postalCode: "01234", taxId: "AAAA123456" });
  assert.equal(value.firstName, "Ana"); assert.equal(value.email, "ana@example.com"); assert.equal(value.postalCode, "01234"); assert.equal(value.phone, "+52 5512345678");
  assert.equal(value.notes, ""); assert.equal(validateClient({ company: "Company only" }).company, "Company only");
});
test("clients require a name or company, valid email and bounded string fields", () => {
  assert.throws(() => validateClient({ email: "person@example.com" }));
  assert.throws(() => validateClient({ firstName: "Ana", email: "invalid-email" }));
  assert.throws(() => validateClient({ firstName: "Ana", phone: 123 }));
  assert.throws(() => validateClient({ firstName: "Ana", notes: "a".repeat(2001) }));
  assert.equal(validateClient({ firstName: "Ana", secret: "ignored" }).secret, undefined);
});
