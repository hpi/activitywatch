#!/usr/bin/node env

const { promisify } = require('util')
const { resolve } = require('path')
const { Command } = require('commander')
const fetch = require('node-fetch')
const dayjs = require('dayjs')
const fs = require('fs')

const program = new Command()

const AW_URL = 'https://activitywatch.maddie.today';

process.on('unhandledRejection', onfatal)
process.on('uncaughtException', onfatal)

function onfatal(err) {
  console.log('fatal:', err.message)
  exit(1)
}

function exit(code) {
  process.nextTick(process.exit, code)
}

program
  .command('dump')
  .description('Dump to file')
  .option('-t, --token [token]', 'Auth token')
  .option('-b, --bucket [bucket]', 'ActivityWatch bucket')
  .option('--export-format <format>', 'Export file format', '{date}-aw.json')
  .option('--export-path [path]', 'Export file path')
  .action(dump)

program.parseAsync(process.argv)

async function dump({
  token,
  bucket,
  exportPath,
  exportFormat,
}) {
  let events
  let currentJSON = {}

  const filledExportFormat = exportFormat
    .replace('{date}', dayjs().format('YYYY-MM-DD'))
    .replace('{bucket}', bucket)

  const EXPORT_PATH = resolve(exportPath, filledExportFormat)

  try {
    const currentValue = await promisify(fs.readFile)(EXPORT_PATH, 'utf8')

    if (currentValue) {
      currentJSON = JSON.parse(currentValue)
    }
  } catch (e) {
  }

  try {
    const eventsRes = await fetch(`${AW_URL}/api/v1/get/${bucket}?date=${dayjs().format('YYYY-MM-DD')}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    events = await eventsRes.json()
  } catch (e) {
    return onfatal(e)
  }

  const dump = JSON.stringify({ [bucket]: events, ...currentJSON })

  await promisify(fs.writeFile)(EXPORT_PATH, dump)
}
