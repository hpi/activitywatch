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

  const filledExportFormat = exportFormat
    .replace('{date}', dayjs().format('YYYY-MM-DD'))

  const EXPORT_PATH = resolve(exportPath, filledExportFormat)

  try {
    const eventsRes = await fetch(`${AW_URL}/api/v1/get/${bucket}?date=${dayjs().format('YYYY-MM-DD')}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    events = await eventsRes.json()

    console.log("EVENT:", events)
  } catch (e) {
    return onfatal(e)
  }

  const dump = JSON.stringify({ events })

  await promisify(fs.writeFile)(EXPORT_PATH, dump)
}

