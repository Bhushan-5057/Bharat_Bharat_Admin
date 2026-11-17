"use client";

import {
  Control,
  FieldErrors,
  UseFormRegister,
  useFieldArray,
} from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input/input";
import { FormField, FormSection } from "@/components/ui/form-field";
import Button from "@/components/ui/button/Button";
import { CreateCityFormData } from "@/validations/citySchema";
import { emptyCityContact } from "./cityContacts";

type CityContactPersonsProps = {
  control: Control<CreateCityFormData>;
  register: UseFormRegister<CreateCityFormData>;
  errors: FieldErrors<CreateCityFormData>;
};

export default function CityContactPersons({
  control,
  register,
  errors,
}: CityContactPersonsProps) {
  const { fields, append, remove } = useFieldArray<
    CreateCityFormData,
    "contacts",
    "fieldId"
  >({
    control,
    name: "contacts",
    keyName: "fieldId",
  });

  const contactsError =
    typeof errors.contacts?.message === "string"
      ? errors.contacts.message
      : errors.contacts?.root?.message;

  return (
    <FormSection
      title="Contact persons"
      description="Optional. Five rows are ready so you can enter contact people. Add more if needed. A row you fill needs a name, mobile number, and designation. Email is optional. Empty rows are ignored."
    >
      {contactsError ? (
        <p className="text-sm text-red-600" role="alert">
          {contactsError}
        </p>
      ) : null}

      {fields.length === 0 ? (
        <p className="text-sm text-gray-500">No contact persons added.</p>
      ) : (
        <div className="space-y-4">
          {fields.map((field, index) => {
            const rowErrors = errors.contacts?.[index];
            const isSaved = field.id != null;

            return (
              <div
                key={field.fieldId}
                className="space-y-4 rounded-lg border border-gray-200 bg-white p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-gray-800">
                    Contact {index + 1}
                  </p>
                  {!isSaved ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => remove(index)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={14} />
                      Remove
                    </Button>
                  ) : null}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    label="Person name"
                    htmlFor={`contacts.${index}.person_name`}
                    required
                    error={rowErrors?.person_name?.message}
                  >
                    <Input
                      id={`contacts.${index}.person_name`}
                      placeholder="Enter person name"
                      {...register(`contacts.${index}.person_name`)}
                    />
                  </FormField>

                  <FormField
                    label="Contact number"
                    htmlFor={`contacts.${index}.contact_number`}
                    required
                    hint="10-digit Indian mobile number"
                    error={rowErrors?.contact_number?.message}
                  >
                    <Input
                      id={`contacts.${index}.contact_number`}
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      placeholder="Enter 10-digit mobile number"
                      {...register(`contacts.${index}.contact_number`)}
                    />
                  </FormField>

                  <FormField
                    label="Email"
                    htmlFor={`contacts.${index}.email`}
                    error={rowErrors?.email?.message}
                  >
                    <Input
                      id={`contacts.${index}.email`}
                      type="text"
                      inputMode="email"
                      placeholder="Enter email (optional)"
                      {...register(`contacts.${index}.email`)}
                    />
                  </FormField>

                  <FormField
                    label="Designation"
                    htmlFor={`contacts.${index}.designation`}
                    required
                    error={rowErrors?.designation?.message}
                  >
                    <Input
                      id={`contacts.${index}.designation`}
                      placeholder="Enter designation in Bharat Bharti"
                      {...register(`contacts.${index}.designation`)}
                    />
                  </FormField>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append(emptyCityContact())}
      >
        <Plus size={14} />
        Add contact
      </Button>
    </FormSection>
  );
}
