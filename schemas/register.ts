import { email, object, string, type infer as zInfer } from "zod";

const phoneRegex = /^\+?[0-9]+$/;

export const phoneSchema = string()
  .min(1, "Phone is required")
  .regex(phoneRegex, "Phone number can only contain numbers and a leading +")
  .min(8, "Phone number is too short")
  .max(15, "Phone number is too long");

// Address sub-fields are individually optional here; the superRefine below
// enforces "all or nothing" so a half-filled address can't be submitted.
const addressFieldsSchema = object({
  country: string().max(56, "Country name is too long").optional(),
  state: string().optional(),
  area: string().optional(),
  address: string().max(200, "Address is too long").optional(),
});

export const registerSchema = object({
  name: string().min(2, "Name is required").max(50, "Name is too long"),
  email: email("Enter a valid email address").max(150, "Email is too long"),
  phone: phoneSchema,
  password: string()
    .min(8, "Password must be at least 8 characters")
    .max(50, "Password is too long"),
  addressDetails: addressFieldsSchema.optional(),
}).superRefine((data, ctx) => {
  const a = data.addressDetails;
  if (!a) return;

  const started = !!(
    a.country?.trim() ||
    a.state ||
    a.area ||
    a.address?.trim()
  );
  if (!started) return;

  if (!a.state) {
    ctx.addIssue({
      code: "custom",
      message: "Governorate is required",
      path: ["addressDetails", "state"],
    });
  }
  if (!a.area) {
    ctx.addIssue({
      code: "custom",
      message: "Area is required",
      path: ["addressDetails", "area"],
    });
  }
  if (!a.address?.trim() || a.address.trim().length < 5) {
    ctx.addIssue({
      code: "custom",
      message: "Address is too short",
      path: ["addressDetails", "address"],
    });
  }
});

export type RegisterFormData = zInfer<typeof registerSchema>;
