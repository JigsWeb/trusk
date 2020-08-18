import { filter } from "lodash";

const errorFunctions = {
  input: value => new Promise((resolve, reject) => value.length ? resolve() : reject('Réponse vide invalide (chaîne de caractères attendue)')),
  number: value => new Promise((resolve, reject) => value && Number.isInteger(value) ? resolve() : reject('Réponse invalide (nombre entier attendu)')),
}

const filterFunctions = {
  input: value => value.trim(),
  number: value => Number.isInteger(parseInt(value)) ? parseInt(value) : value
}

export default [
  {
    inquirerPromptConfig: {
      type: 'input',
      name: 'value',
      message: 'Comment vous apellez-vous ? (ex: Jean Dupont)',
      filter: filterFunctions.input
    },
    key: 'name',
    validate: errorFunctions.input,
  },
  {
    inquirerPromptConfig: {
      type: 'input',
      name: 'value',
      message: 'Quel est le nom de votre société ? (ex: Carrefour)',
      filter: filterFunctions.input
    },
    key: 'companyName',
    validate: errorFunctions.input,
  },
  {
    inquirerPromptConfig: {
      type: 'input',
      name: 'value',
      message: 'Combien d\'employé(e)s avez-vous ?',
      filter: filterFunctions.number
    },
    key: 'employeesCount',
    validate: errorFunctions.number,
    isCount: true,
    inquirerArrayPromptConfig: [
      {
        inquirerPromptConfig: {
          type: 'input',
          name: 'value',
          message: 'Employé(e) $ - Comment s\'apelle t-il ?',
          filter: filterFunctions.input
        },
        key: 'employees.$.name',
        validate: errorFunctions.input,
      },
    ]
  },
  {
    inquirerPromptConfig: {
      type: 'input',
      name: 'value',
      message: 'Combien de camion avez-vous ?',
      filter: filterFunctions.number
    },
    key: 'trucksCount',
    validate: errorFunctions.number,
    isCount: true,
    inquirerArrayPromptConfig: [
      {
        inquirerPromptConfig: {
          type: 'input',
          name: 'value',
          message: 'Camion $ - Quel est son volume en m3 ?',
          filter: filterFunctions.number
        },
        key: 'trucks.$.volume',
        validate: errorFunctions.number,
      },
      {
        inquirerPromptConfig: {
          type: 'list',
          choices: ['IVECO', 'Kangoo', 'BusMagic'],
          name: 'value',
          message: 'Camion $ - Quel type de camion ?',
        },
        key: 'trucks.$.type',
      },
    ]
  },
];