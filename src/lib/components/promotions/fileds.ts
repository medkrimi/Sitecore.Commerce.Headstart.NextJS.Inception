import type {Field, RuleType} from "react-querybuilder"

import {defaultOperators} from "react-querybuilder"

export const validator = (r: RuleType) => !!r.value

export const fields: Field[] = [
  {
    name: "firstName",
    label: "First Name",
    placeholder: "Enter first name",
    validator
  },
  {
    name: "lastName",
    label: "Last Name",
    placeholder: "Enter last name",
    defaultOperator: "beginsWith",
    validator
  },
  {name: "age", label: "Age", inputType: "number", validator},
  {
    name: "gender",
    label: "Gender",
    operators: defaultOperators.filter((op) => op.name === "="),
    valueEditorType: "radio",
    values: [
      {name: "M", label: "Male"},
      {name: "F", label: "Female"},
      {name: "O", label: "Other"}
    ]
  },
  {name: "birthdate", label: "Birth Date", inputType: "date"}
]
