#!/usr/bin/env node

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

let innerCount = 0

const isFloat = n => n === +n && n !== (n | 0)
const getProtoType = (obj) => {
  const t = typeof obj
  if (t === 'number') {
    if (isFloat(obj)) {
      return 'float'
    } else {
      return obj < 0 ? 'sint32' : 'uint32'
    }
  }

  if (t === 'object') {
    if (Array.isArray(obj)) {
      return 'repeated ' + getProtoType(obj[0])
    } else {
      innerCount++
      return getTypesForObject(obj, `InnerType${innerCount}`).split('\n').join('\n  ') + `\n  InnerType${innerCount}`
    }
  }

  if (t === 'string') {
    if (Number(obj) == obj) {
      return 'int64'
    }
    return 'string'
  }

  if (t === 'boolean') {
    return 'bool'
  }
}

const getTypesForObject = (js, name) => {
  if (js === null || js === undefined) {
    return 'Null' // you should define this as message Null {}
  }
  return `message ${name} {\n` + Object.keys(js).map((k, i) => `  ${getProtoType(js[k])} ${k} = ${i + 1};`)
  .join('\n') + '\n}'
}

let out = ''
process.stdin.on('readable', () => {
  const chunk = process.stdin.read()
  if (chunk !== null) {
    out += chunk.toString()
  }
})
process.stdin.on('end', () => { console.log('syntax = "proto3";\n\n' + getTypesForObject(JSON.parse(out), process.argv[2])) })
