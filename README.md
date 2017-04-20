# js2proto

Dumb utility to convert a JSON object into a protobuf message definition

You could be using a struct to describe the general concept of JSON, but this will try to guess the defined scalar types, so you can quickly build a spec for some random JSON.

## install

Install this with `npm i -g js2proto`.

## usage

js2proto takes JSON on stdin, and outputs a protobuf to stdout.


```
cat MYFILE.json | js2proto TypeName > typename.proto
```

Where
* MYFILE.json is your JSON file
* TypeName is the name of your message-type
* typename.proto is the name of the file you want to output

## notes



## example

```json
{
  "testNum": 5,
  "testString": "tester",
  "testBool": true,
  "testArray": [1,2,3,4],
  "testObj": {
    "testNum": 5,
    "testString": "tester",
    "testBool": true,
    "testArray": [1,2,3,4]
  }
}
```

becomes

```proto
syntax = "proto3";

message Test {
  uint32 testNum = 1;
  string testString = 2;
  bool testBool = 3;
  repeated uint32 testArray = 4;
  message InnerType1 {
    uint32 testNum = 1;
    string testString = 2;
    bool testBool = 3;
    repeated uint32 testArray = 4;
  }
  InnerType1 testObj = 5;
}
```