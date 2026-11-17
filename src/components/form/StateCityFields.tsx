"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input/input";
import { INDIAN_STATES, stateSelectClassName } from "@/constants/indianStates";
import { fetchAllCities } from "@/store/api/cityApi";

const sameName = (left?: string, right?: string) =>
  String(left || "").trim().toLowerCase() === String(right || "").trim().toLowerCase();

type StateCityFieldsProps = {
  stateValue: string;
  cityValue: string;
  onStateChange: (value: string) => void;
  onCityChange: (value: string) => void;
  stateError?: string;
  cityError?: string;
};

export default function StateCityFields({
  stateValue,
  cityValue,
  onStateChange,
  onCityChange,
  stateError,
  cityError,
}: StateCityFieldsProps) {
  const listId = useId().replace(/:/g, "");
  const [cities, setCities] = useState<{ title: string; state?: string }[]>([]);

  useEffect(() => {
    let active = true;
    fetchAllCities()
      .then((rows) => {
        if (!active) return;
        setCities(
          rows.map((city) => ({
            title: city.title,
            state: city.state || "",
          }))
        );
      })
      .catch(() => {
        if (active) setCities([]);
      });
    return () => {
      active = false;
    };
  }, []);

  const stateOptions = useMemo(() => {
    if (stateValue && !INDIAN_STATES.includes(stateValue as (typeof INDIAN_STATES)[number])) {
      return [stateValue, ...INDIAN_STATES];
    }
    return [...INDIAN_STATES];
  }, [stateValue]);

  const cityOptions = useMemo(() => {
    const titles = cities
      .filter((city) => {
        const title = city.title?.trim();
        if (!title || !stateValue) return false;
        const savedState = city.state?.trim() || "";
        return !savedState || sameName(savedState, stateValue);
      })
      .map((city) => city.title.trim());
    return Array.from(new Set(titles)).sort((left, right) => left.localeCompare(right));
  }, [cities, stateValue]);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <FormField label="State" htmlFor="state" required error={stateError}>
        <select
          id="state"
          className={stateSelectClassName}
          value={stateValue}
          onChange={(event) => onStateChange(event.target.value)}
        >
          <option value="">Select state</option>
          {stateOptions.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </FormField>

      <FormField
        label="City"
        htmlFor="venue"
        required
        hint={
          stateValue
            ? "Pick a city from Our Presence, or type the name if it is not listed."
            : "Select a state first."
        }
        error={cityError}
      >
        <Input
          id="venue"
          list={listId}
          value={cityValue}
          placeholder={stateValue ? "Select or type a city name" : "Select a state first"}
          disabled={!stateValue && !cityValue}
          onChange={(event) => onCityChange(event.target.value)}
        />
        <datalist id={listId}>
          {cityOptions.map((name) => (
            <option key={name} value={name} />
          ))}
        </datalist>
      </FormField>
    </div>
  );
}
