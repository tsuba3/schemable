
const T = require(".")
const assert = require("assert")

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



// Types

T.num.validate(3.14)
T.int.validate(3)
T.str.validate("3")
T.bool.validate(true)
T.null.validate(null)
T.null.validate(undefined)
T.array(T.int).validate([1,2,3])
T.obj({i: T.int}).validate({i: 3})
T.option(T.int).validate(null)
T.option(T.int).validate(3)
T.oneOf([1,2,3]).validate(3)

assert.throws(() => T.num.validate("45"))
assert.throws(() => T.num.validate({i: 5}))
assert.throws(() => T.int.validate(3.01))
assert.throws(() => T.int.validate("98"))
assert.throws(() => T.str.validate(7))
assert.throws(() => T.bool.validate(1))
assert.throws(() => T.null.validate(0))
assert.throws(() => T.array(T.any).validate({0: "v0"}))
assert.throws(() => T.obj({s: T.str}).validate({}))
assert.throws(() => T.obj({}).validate([]))
assert.throws(() => T.option(T.int).validate("string"))
assert.throws(() => T.oneOf([1, "a"]).validate("1"))



// Options

// Options can be chained
assert(T.str.atLeast(3).bellow(10).match(/0x[0-9a-f]*/).validate("0x181cd"))

assert.throws(() => T.num.atLeast(10).validate(9))
assert(T.num.atLeast(10).validate(10))
assert(T.num.atLeast(10).validate(11))

assert(T.num.atMost(10).validate(9))
assert(T.num.atMost(10).validate(10))
assert.throws(() => T.num.atMost(10).validate(11))

assert.throws(() => T.num.above(10).validate(9))
assert.throws(() => T.num.above(10).validate(10))
assert(T.num.above(10).validate(11))

assert(T.num.bellow(10).validate(9))
assert.throws(() => T.num.bellow(10).validate(10))
assert.throws(() => T.num.bellow(10).validate(11))

assert.throws(() => T.num.between(1, 3).validate(0))
assert(T.num.between(1, 3).validate(1))
assert(T.num.between(1, 3).validate(3))
assert.throws(() => T.num.between(1, 3).validate(4))


// Arrays and strings is compared with its length
T.array(T.int).atLeast(3).validate([1, 2, 3])
T.str.atLeast(7).validate("1234567")


assert(T.str.match(/[0-2][0-9]:[0-5][0-9]*/).validate("12:55"))
assert.throws(() => T.str.match(/[0-2][0-9]:[0-5][0-9]*/).validate("17:67"))

assert.throws(() => T.str.notMatch(/[0-2][0-9]:[0-5][0-9]*/).validate("12:55"))
assert(T.str.notMatch(/[0-2][0-9]:[0-5][0-9]*/).validate("17:67"))


// Custom validator
assert(T.addValidator((x, path) => {
	if (x % 2 != 0) {
		throw new Error(`${path} shoud be even`)
	}
}))

// map
assert(T.int.map(x => x * 2).validate(10) === 20)

// catch
assert(T.int.catch((e, x) => Math.floor(x) || 0).validate(12.5) === 12)


console.log("All test passed.")
