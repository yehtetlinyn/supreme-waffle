import React from "react";
import Select, { components } from "react-select";
import { IoMdArrowDropdown } from "react-icons/io";
import usePageStore from "@/store/pageStore";

const DropdownIndicator = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <IoMdArrowDropdown size={30} color="var(--primary-yellow)" />
    </components.DropdownIndicator>
  );
};

const SelectBox = ({
  placeholder,
  options,
  value,
  onChange,
  priority = false,
  ref,
  selectRef,
  filterForm = false,
  inputForm = false,
  crudForm = false,
  view = false,
  instanceId = "",
  defaultSelector = "",
  sop = false,
  formErrors,
  name = "",
}) => {
  const getBorderColor = (state) => {
    if (filterForm) {
      return !state.isFocused ? "none" : "";
    } else if (crudForm) {
      if (formErrors) {
        return state.isFocused
          ? "1px solid var(--error-border)"
          : "1px solid var(--error-border)";
      } else {
        return state.isFocused
          ? "1px solid var(--primary-yellow)"
          : "1px solid var(--input-border)";
      }
    }
  };

  const getColors = (theme) => {
    return formErrors
      ? {
          ...theme.colors,
          primary50: "var(--active-yellow)",
          primary: "var(--error-border)",
          primary25: "var(--error-border)",
          neutral30: "var(--error-border)",
        }
      : {
          ...theme.colors,
          primary50: "var(--active-yellow)",
          primary: "var(--primary-yellow)",
          primary25: "var(--primary-yellow)",
          neutral30: "var(--input-border)",
        };
  };

  const customStyles = {
    // *input box
    control: (baseStyles, state) => {
      return {
        ...baseStyles,
        padding: crudForm ? "6px 6px" : "2px 6px",
        border: getBorderColor(state),
        boxShadow:
          filterForm &&
          "0px 1px 3px 0px rgba(0, 0, 0, 0.08), 0px 4px 6px 0px rgba(50, 50, 93, 0.11)",
        borderRadius: "6px",
        fontSize: filterForm ? "16px" : "14px",
        fontWeight: priority ? "600" : "400",
        width: inputForm && "300px",
      };
    },

    // * for input text
    singleValue: (baseStyles) => ({
      ...baseStyles,
      // * for priority input color
      color: priority
        ? value?.value == "High" || value?.value == "Urgent"
          ? "var(--text-red)"
          : value?.value == "Medium"
          ? "var(--text-orange)"
          : value?.value == "Low"
          ? "var(--primary-yellow)"
          : ""
        : "#000",
    }),

    // *menu container
    menu: (baseStyles, state) => ({
      ...baseStyles,
      borderRadius: "6px",
      padding: "0",
      zIndex: "9999",
    }),

    placeholder: (baseStyles) => ({
      ...baseStyles,
      color: "var(--placeholder-text)",
      fontSize: "14px",
      fontWeight: "400",
    }),

    // *menu list
    option: (baseStyles, state) => {
      return {
        ...baseStyles,
        backgroundColor: state.isSelected ? "var(--primary-yellow)" : "",
        "&:hover": {
          ...baseStyles,
          backgroundColor: "var(--hover-yellow)",
          color: "var(--white)",
          fontWeight: "400",
        },
      };
    },

    //indicator style
    dropdownIndicator: (base) => ({
      ...base,
      padding: crudForm ? 0 : 8,
    }),
  };
  const { setSelectedAccordion } = usePageStore((state) => ({
    setSelectedAccordion: state.setSelectedAccordion,
  }));

  const inputValue = options.find((option) => option.value == value?.value);

  const getInputValue = (value) => {
    if (value) {
      return value;
    } else {
      return sop ? "" : defaultSelector ? options[0] : "";
    }
  };

  return (
    <Select
      placeholder={placeholder}
      options={options}
      isSearchable={false}
      ref={
        crudForm && sop
          ? (ref) => {
              selectRef.current = ref;
            }
          : undefined
      }
      isDisabled={view}
      instanceId={instanceId}
      components={{
        DropdownIndicator,
        IndicatorSeparator: () => null,
      }}
      value={getInputValue(inputValue)}
      onChange={(selected) => {
        onChange(selected);
        setSelectedAccordion(selected?.id);
      }}
      theme={(theme) => ({
        ...theme,
        borderRadius: "6px",
        colors: getColors(theme),
      })}
      styles={customStyles}
      menuPortalTarget={document.body}
      menuPosition={"fixed"}
    />
  );
};

export default SelectBox;
