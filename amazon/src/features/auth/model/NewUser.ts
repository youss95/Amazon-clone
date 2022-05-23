import { RegisterFormField } from "./RegisterFormFieldInterface";

export type NewUser = Omit<RegisterFormField, "confirmPassword">;
