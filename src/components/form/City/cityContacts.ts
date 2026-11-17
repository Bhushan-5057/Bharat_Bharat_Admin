import { FieldPath, FieldValues, UseFormSetError } from "react-hook-form";
import { CityContact } from "@/types/cityTypes";
import { CityContactFormValue } from "@/validations/citySchema";
import { getApiFieldErrors, toFormErrorPath } from "@/lib/utils/apiError";

export const emptyCityContact = (): CityContactFormValue => ({
  person_name: "",
  contact_number: "",
  email: "",
  designation: "",
});

export const MINIMUM_CITY_CONTACTS = 5;

export const minimumCityContacts = (
  contacts?: CityContactFormValue[]
): CityContactFormValue[] => {
  const next = Array.isArray(contacts) ? [...contacts] : [];
  while (next.length < MINIMUM_CITY_CONTACTS) {
    next.push(emptyCityContact());
  }
  return next;
};

export function isBlankCityContact(
  contact: Partial<CityContactFormValue> | undefined
): boolean {
  if (!contact) return true;
  if (contact.id != null) return false;
  return ![
    contact.person_name,
    contact.contact_number,
    contact.email,
    contact.designation,
  ].some((value) => (value ?? "").trim() !== "");
}

export function contactsFromCity(
  contacts?: CityContact[] | null
): CityContactFormValue[] {
  if (!Array.isArray(contacts) || contacts.length === 0) return [];

  return contacts.map((contact) => {
    const parsedId = Number(contact.id);
    return {
      id: Number.isInteger(parsedId) ? parsedId : undefined,
      person_name: contact.person_name ?? "",
      contact_number: contact.contact_number ?? "",
      email: contact.email ?? "",
      designation: contact.designation ?? "",
    };
  });
}

export function toCityContactPayload(
  contacts?: CityContactFormValue[]
): CityContact[] {
  if (!Array.isArray(contacts)) return [];

  return contacts.filter((contact) => !isBlankCityContact(contact)).map((contact) => {
    const payload: CityContact = {
      person_name: (contact.person_name ?? "").trim(),
      contact_number: (contact.contact_number ?? "").trim(),
    };

    const email = contact.email?.trim();
    const designation = contact.designation?.trim();
    if (email) payload.email = email;
    if (designation) payload.designation = designation;
    if (contact.id != null && Number.isInteger(contact.id)) {
      payload.id = contact.id;
    }

    return payload;
  });
}

export function applyCityApiFieldErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>
): boolean {
  const fieldErrors = getApiFieldErrors(error);
  if (fieldErrors.length === 0) return false;

  fieldErrors.forEach(({ path, msg }) => {
    setError(toFormErrorPath(path) as FieldPath<T>, {
      type: "server",
      message: msg,
    });
  });

  return true;
}
