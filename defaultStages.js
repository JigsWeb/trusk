export default [
  {
    inquirerPromptConfig: {
      type: 'input',
      name: 'value',
      message: 'Comment vous apellez-vous ? (ex: Jean Dupont)',
      filter: value => value.trim()
    },
    key: 'name',
    validate: value => new Promise((resolve, reject) => value.length ? resolve() : reject()),
  },
  {
    inquirerPromptConfig: {
      type: 'input',
      name: 'value',
      message: 'Quel est le nom de votre société ? (ex: Carrefour)',
      filter: value => value.trim()
    },
    key: 'companyName',
    validate: value => new Promise((resolve, reject) => value.length ? resolve() : reject()),
  },
  {
    inquirerPromptConfig: {
      type: 'input',
      name: 'value',
      message: 'Combien d\'employé(e)s avez-vous ?',
      filter: value => parseInt(value)
    },
    key: 'employeesCount',
    validate: value => new Promise((resolve, reject) => value && Number.isInteger(value) ? resolve() : reject()),
    isCount: true,
    inquirerArrayPromptConfig: [
      {
        inquirerPromptConfig: {
          type: 'input',
          name: 'value',
          message: 'Employé(e) $ - Comment s\'apelle t-il ?',
          filter: value => value.trim()
        },
        key: 'employees.$.name',
        validate: value => new Promise((resolve, reject) => value.length ? resolve() : reject()),
      },
    ]
  },
  {
    inquirerPromptConfig: {
      type: 'input',
      name: 'value',
      message: 'Combien de camion avez-vous ?',
      filter: value => parseInt(value)
    },
    key: 'trucksCount',
    validate: value => new Promise((resolve, reject) => value && Number.isInteger(value) ? resolve() : reject()),
    isCount: true,
    inquirerArrayPromptConfig: [
      {
        inquirerPromptConfig: {
          type: 'input',
          name: 'value',
          message: 'Camion $ - Quel est son volume en m3 ?',
          filter: value => parseInt(value)
        },
        key: 'trucks.$.volume',
        validate: value => new Promise((resolve, reject) => value && Number.isInteger(value) ? resolve() : reject()),
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