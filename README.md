# Schemable
JSON Object Type Check Library

## Usage

```javascript
const user = T.obj({
    name: T.str.atLeast(4),
    pass: T.str.match(/[0-9a-zA-Z]{4,}/),
    age: T.int.atLeast(0),
    sex: T.oneOf(["male", "female"])
})

user.validate({
    name: "Beckey",
    pass: "P4SS",
    age: 19,
    sex: "female"
})

assert.throws(() => user.validate({
    name: "Beckey",
    pass: "P",
    age: 19,
    sex: "female"
}))
```

For more detail, see [example.js](https://github.com/tsuba3/schemable/blob/master/example.js)

