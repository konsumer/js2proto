# DEPRACATED

Use [json2x](https://github.com/konsumer/json2x) instead. It does imilar, but lots more.

Original README:

---

Dumb utility to convert a JSON object into a protobuf message definition

With this tool you can quickly build a spec for some random JSON. It's not 100%, and you may have to tune it by hand, but it will get you started.

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

becomes (via `cat test.json | js2proto Test`)

```proto
syntax = "proto3";

message TestObj {
  int32 testNum = 1;
  string testString = 2;
  bool testBool = 3;
  repeated int32 testArray = 4;
}

message Test {
  int32 testNum = 1;
  string testString = 2;
  bool testBool = 3;
  repeated int32 testArray = 4;
  TestObj testObj = 5;
}
```

By comparing `Test` with `TestObject`, you can infer that it's a recursive `Test` structure, and further tune it by hand:

```proto
syntax = "proto3";

message Test {
  int32 testNum = 1;
  string testString = 2;
  bool testBool = 3;
  repeated int32 testArray = 4;
  Test testObj = 5;
}
```
