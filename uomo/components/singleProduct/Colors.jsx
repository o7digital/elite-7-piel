"use client";

import React, { useEffect, useId } from "react";
import tippy from "tippy.js";
const switches = [
  {
    label: "Black",
    color: "#222",
    defaultChecked: false,
  },
  {
    label: "Red",
    color: "#c93a3e",
    defaultChecked: true,
  },
  {
    label: "Grey",
    color: "#e4e4e4",
    defaultChecked: false,
  },
];

const COLOR_MAP = {
  beige: "#d8c3a5",
  black: "#222222",
  blue: "#3f6ad8",
  brown: "#7a4f2a",
  gold: "#c7a33c",
  gray: "#8c8c8c",
  green: "#4f8a4b",
  grey: "#8c8c8c",
  orange: "#f39c12",
  pink: "#e98ca8",
  purple: "#6f42c1",
  red: "#c93a3e",
  silver: "#c0c0c0",
  white: "#e4e4e4",
  yellow: "#f1c40f",
};

function resolveColor(label = "") {
  const normalizedLabel = label
    .toLowerCase()
    .replace(/\s+\d+$/, "")
    .trim();

  return COLOR_MAP[normalizedLabel] || "#222222";
}

export default function Colors({ colors }) {
  const baseId = useId();

  useEffect(() => {
    tippy("[data-tippy-content]");
  }, []);

  const colorsArray = (colors?.length ? colors : switches).map(
    (swatch, index) => {
      const label =
        typeof swatch === "string"
          ? swatch
          : swatch.label || swatch.name || `Color ${index + 1}`;

      return {
        id:
          typeof swatch === "object" && swatch.id
            ? swatch.id
            : `${baseId}-color-${index + 1}`,
        label,
        color:
          typeof swatch === "object" && swatch.color
            ? swatch.color
            : resolveColor(label),
        defaultChecked:
          typeof swatch === "object" && swatch.defaultChecked !== undefined
            ? swatch.defaultChecked
            : index === 0,
      };
    }
  );

  return (
    <>
      {colorsArray.map((swatch) => (
        <React.Fragment key={swatch.id}>
          <input
            type="radio"
            name="color"
            id={swatch.id}
            defaultChecked={swatch.defaultChecked}
          />
          <label
            className="swatch swatch-color js-swatch"
            htmlFor={swatch.id}
            aria-label={swatch.label}
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            data-tippy-content={swatch.label}
            style={{ color: swatch.color }}
          ></label>
        </React.Fragment>
      ))}
    </>
  );
}
