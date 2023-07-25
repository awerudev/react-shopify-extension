import { Fragment, useMemo, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon } from "lucide-react";
import { getZipCodeAutoComplete } from "@/hooks";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { shippingFormSchema } from "@/components/customer-form";
import { CountryData, CountryState, ZipCodeResponse } from "@/types";
import { useAddressConfirmation } from "@/hooks/useAddressConfirmation";
import { cn } from "@/lib/utils";

interface PostCodeData {
  countryData: CountryData[];
  form: UseFormReturn<z.infer<typeof shippingFormSchema>>;
  countryState: CountryState[];
}

export default function PostCodeAutoComplete({
  countryData,
  form,
  countryState,
}: PostCodeData) {
  const [postCodeData, setPostCodeData] = useState<ZipCodeResponse[]>([]);
  const [selected, setSelected] = useState(postCodeData[0]);
  const [query, setQuery] = useState("");
  const isConfirmed = useAddressConfirmation((state) => state.isConfirmed);
  const isInvalid = useAddressConfirmation((state) => state.isInvalid);

  const filteredPost = useMemo(() => {
    return query === ""
      ? postCodeData
      : postCodeData.filter((postCode) =>
          postCode.postCode.toLowerCase().includes(query.toLowerCase())
        );
  }, [postCodeData, query]);

  const formValue = form.getValues("postCode");

  return (
    <Combobox
      value={selected || formValue}
      onChange={(value) => {
        setSelected(value);
        const state = countryState.find(
          (s) => s.shortCode === value.subdivisionCode
        );
        if (state) form.setValue("state", state.id);

        form.setValue("postCode", value.postCode);
        form.setValue("city", value.cityName);
      }}
    >
      <div className="relative mt-1">
        <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none sm:text-sm">
          <Combobox.Input
            className={cn(
              "flex h-[50px] w-full rounded-md border border-input px-3 py-3 text-sm  file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:ring-2 focus:ring-offset-2 focus:outline-none ring-slate-400",
              isConfirmed
                ? "border border-border_confirmed bg-input_confirmed"
                : isInvalid
                ? "border border-red-400"
                : ""
            )}
            displayValue={() => formValue}
            onChange={(event) => {
              form.setValue("postCode", event.target.value);
              setQuery(event.target.value);
              getZipCodeAutoComplete({
                zipCode: event.target.value,
                country: countryData[0].countryCode,
                language: countryData[0].language,
              }).then((res) => {
                if (res.predictions) setPostCodeData(res.predictions);
              });
            }}
            placeholder={"Post Code ..."}
          />
        </div>
      </div>
      <Transition
        as={Fragment}
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        afterLeave={() => setQuery("")}
      >
        <Combobox.Options className="absolute mt-1 max-h-60 w-full max-w-[200px] overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm px-2">
          {filteredPost.length === 0 && query !== "" ? (
            <div className="relative cursor-default select-none py-2 px-2 text-gray-700">
              Nothing found.
            </div>
          ) : (
            filteredPost.map((post, key) => (
              <Combobox.Option
                key={key}
                className={({ active }) =>
                  `relative cursor-pointer select-none py-2 px-2 ${
                    active ? "bg-darkGreen" : "text-gray-900"
                  } ${key === 0 ? "bg-darkGreen" : ""}`
                }
                value={post}
              >
                {({ selected, active }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? "font-medium" : "font-normal"
                      }`}
                    >
                      <span>
                        <span className="text-suggestion border-b border-dashed border-border_confirmed font-semibold">
                          {post.postCode.substring(0, formValue.length)}
                        </span>
                        {post.postCode.substring(formValue.length)}
                      </span>
                      <span>, {post.cityName}</span>
                      <span className="text-neutral-400">
                        ,{" "}
                        {
                          countryState.find(
                            (item) => item.shortCode === post.subdivisionCode
                          )?.name
                        }
                      </span>
                    </span>
                    {selected ? (
                      <span
                        className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                          active ? "text-white" : "text-suggestion"
                        }`}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Combobox.Option>
            ))
          )}
        </Combobox.Options>
      </Transition>
    </Combobox>
  );
}
