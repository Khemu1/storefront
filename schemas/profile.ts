import {
  boolean,
  object,
  string,
  email as zEmail,
  type infer as zInfer,
} from "zod";

const phoneRegex = /^\+?[0-9]+$/;

export const phoneSchema = string()
  .min(1, "Phone is required")
  .regex(phoneRegex, "Phone number can only contain numbers and a leading +")
  .min(8, "Phone number is too short")
  .max(15, "Phone number is too long");

export const accountInfoSchema = object({
  name: string().min(2, "Name is required").max(50, "Name is too long"),
  phone: phoneSchema,
});

export const emailFormSchema = object({
  email: zEmail("Enter a valid email address"),
});

export const passwordFormSchema = object({
  new_password: string()
    .min(8, "Password must be at least 8 characters")
    .max(50),
  confirm_password: string().min(1, "Please confirm your password"),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
});

export const addressSchema = object({
  country: string()
    .min(1, "Country is required")
    .max(56, "Country name is too long"),
  state: string()
    .min(1, "Governorate is required")
    .max(100, "Governorate is too long"),
  area: string().min(1, "Area is required").max(100, "Area is too long"),
  address: string()
    .min(5, "Address is too short")
    .max(500, "Address is too long"),
  is_default: boolean(),
});

export type AccountInfoFormData = zInfer<typeof accountInfoSchema>;
export type EmailFormData = zInfer<typeof emailFormSchema>;
export type PasswordFormData = zInfer<typeof passwordFormSchema>;
export type AddressFormData = zInfer<typeof addressSchema>;
