#!/usr/bin/env node

const classify = require('inflection').classify

if (!process.argv[2]) {
  console.error(`
Usage: cat MYFILE.json | js2proto TypeName > typename.proto

Where
  MYFILE.json is your JSON file
  TypeName is the name of your message-type
  typename.proto is the name of the file you want to output

`)
  process.exit(1)
}

let data = ''
const messages = {}

const isFloat = n => n === +n && n !== (n | 0)

process.stdin.on('data', (chunk) => {
  data += chunk
})

process.stdin.on('end', () => {
  const obj = JSON.parse(data)
  // get all message-types
  handleMessage(obj, process.argv[2])
  console.log('syntax = "proto3";\n')
  Object.keys(messages).forEach(key => {
    console.log(`message ${key} {`)
    console.log('  ' + messages[key].join('\n  '))
    console.log('}\n')
  })
})

const getType = (val) => {
  let t = typeof val
  if (t === 'object' && Array.isArray(val)) {
    return 'array'
  }
  if (t === 'number') {
    if (isFloat(val)) {
      return 'float'
    } else {
      return 'int32'
    }
  }
  if (t === 'boolean') {
    return 'bool'
  }
  return t
}

const handleMessage = (obj, name) => {
  messages[name] = Object.keys(obj).map((key, i) => {
    const t = getType(obj[key])
    switch (t) {
      case 'array':
        const rt = getType(obj[key][0])
        if (rt === 'object') {
          handleMessage(obj[key][0], classify(key))
          return `repeated ${classify(key)} = ${i + 1};`
        } else {
          return `repeated ${rt} ${key} = ${i + 1};`
        }
      case 'object':
        messages[classify(key)] = handleMessage(obj[key], classify(key))
        return `${classify(key)} ${key} = ${i + 1};`
      default:
        return `${t} ${key} = ${i + 1};`
    }
  })
  return messages[name]
}
