import inquirer from 'inquirer';
import Redis from "ioredis";
import { get, set } from "lodash";

import defaultStages from './defaultStages'

require('dotenv').config()

const redis = new Redis(process.env.REDIS_PORT, {host: process.env.REDIS_HOST});

let stages = defaultStages;

function getTrusker() {
  return new Promise(resolve => redis.get('trusker', (_, result) => resolve(result ? JSON.parse(result) : {})))
}

function saveTrusker(trusker) {
  return new Promise(resolve => redis.set('trusker', JSON.stringify(trusker)).then(resolve))
}

function resetTrusker() {
  return saveTrusker({});
}

function formatStageWithIndex(stage, i) {
  return {
    ...stage,
    key: stage.key.replace('$', i),
    inquirerPromptConfig: { ...stage.inquirerPromptConfig, message: stage.inquirerPromptConfig.message.replace('$', i + 1) },
  }
}

async function restart() {
  stages = defaultStages;

  computeStage();
}

async function displayInformations(trusker) {
  console.log("\nRécapitulatif de vos informations :\n\n")

  stages.forEach(stage => console.log(stage.inquirerPromptConfig.message, get(trusker, stage.key)))

  const { isValid } = await inquirer.prompt([{ message: 'Les informations sont elles valides?', type: 'confirm', name: 'isValid' }])

  await resetTrusker();

  if (!isValid)
    return restart();
  
  console.log('\nMerci pour votre patience, nous reviendrons vers vous bientot');
  process.exit();
}

async function computeStage(stageIndex = 0, trusker = null, error = false) {
  const next = () => stages[++stageIndex] ? computeStage(stageIndex, trusker) : displayInformations(trusker);
  // Add a stages pipeline for each new employee/truck, can be a memory issue
  const pushNewStages = length => stages.splice(stageIndex + 1, 0, ...Array.from({ length }).flatMap((_, i) => stages[stageIndex].inquirerArrayPromptConfig.map(stage => formatStageWithIndex(stage, i)))); // magic ?

  if (!trusker)
    trusker = await getTrusker();

  const stage = stages[stageIndex];

  if (get(trusker, stage.key)) {
    console.log(stage.inquirerPromptConfig.message, get(trusker, stage.key))
    
    if (stage.isCount)
      pushNewStages(get(trusker, stage.key));

    return next();
  }

  try {
    const { value } = await inquirer.prompt(stage.inquirerPromptConfig)
    
    try {
      if (stage.validate)
        await stage.validate(value)

      set(trusker, stage.key, value);

      await saveTrusker(trusker);

      if (stage.isCount)
        pushNewStages(value);
      
      return next();
    } catch (error) {
      console.log(`Erreur: ${error}`);
      return computeStage(stageIndex, trusker, true);
    }
  } catch (error) {
    console.log(error)
  }
}

computeStage();
