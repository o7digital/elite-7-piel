"use client";

import { Fragment, useEffect, useId } from "react";
import tippy from "tippy.js";

const defaultSizes = ["XS", "S", "M", "L", "XL"];

export default function Size({ sizes }) {
  const baseId = useId();

  useEffect(() => {
    tippy("[data-tippy-content]");
  }, []);

  const sizeOptions = (sizes?.length ? sizes : defaultSizes).map(
    (size, index) => ({
      id: `${baseId}-size-${index + 1}`,
      label: typeof size === "string" ? size : size.label || size.value || "N/A",
    })
  );

  return (
    <>
      {sizeOptions.map((size, index) => (
        <Fragment key={size.id}>
          <input
            type="radio"
            name={`${baseId}-size`}
            id={size.id}
            defaultChecked={index === 0}
          />
          <label
            className="swatch js-swatch"
            htmlFor={size.id}
            aria-label={size.label}
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            data-tippy-content={size.label}
          >
            {size.label}
          </label>
        </Fragment>
      ))}
    </>
  );
}
