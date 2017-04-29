
function type(obj) {
	return Object.prototype.toString.call(obj).slice(8, -1)
}

class Schemable {

	constructor(validator) {
		this.validator = validator || []
	}

	addValidator(f) {
		const res = new Schemable(this.validator.concat(f))
		return res
	}


	get any() {
		return this
	}

	get num() {
		return this.addValidator((x, path) => {
			if (type(x) != "Number") {
				throw new Error(`${path} should be a number`)
			}
		})
	}

	get number() {
		return this.num
	}

	get int() {
		return this.addValidator((x, path) => {
			if (Math.floor(x) !== x) {
				throw new Error(`${path} should be an interger`)
			}
		})
	}

	get interger() {
		return this.int
	}

	get str() {
		return this.addValidator((x, path) => {
			if (type(x) != "String") {
				throw new Error(`${path} should be a string`)
			}
		})
	}

	get string() {
		return str
	}

	get bool() {
		return this.addValidator((x, path) => {
			if (type(x) != "Boolean") {
				throw new Error(`${path} should be a boolean`)
			}
		})
	}

	get array() {
		return this.addValidator((x, path) => {
			if (type(x) != "Array") {
				throw new Error(`${path} should be an array`)
			}
		})
	}

	obj(obj) {
		return this.addValidator((x, path) => {
			if (type(x) != "Object") throw new Error(`${path} should be an object`)
			Object.keys(obj).forEach(key => {
				const p = path == "It" ? key : `${path}.${key}`
				obj[key].validate(x[key], p)
			})
		})
	}

	object(obj) {
		return this.obj(obj)
	}

	option(nullable) {
		return this.addValidator((x, path) => {
			if (x !== null) nullable.validate(x)
		})
	}

	oneOf(array) {
		return this.addValidator((x, path) => {
			if (array.find(v => v === x) == undefined) {
				throw new Error(`${path} shoud be one of ${array}`)
			}
		})
	}


	atLeast(n) {
		return this.addValidator((x, path) => {
			switch (type(x)) {
				case "Number":
					if (x < n) throw new Error(`${path} should be at least ${n}`)
				case "Array":
				case "String":
					if (x.length < n) throw new Error(`${path}.length should be at least ${n}`)
			}
		})
	}

	atMost(n) {
		return this.addValidator((x, path) => {
			switch (type(x)) {
				case "Number":
					if (x > n) throw new Error(`${path} should be at most ${n}`)
				case "Array":
				case "String":
					if (x.length > n) throw new Error(`${path}.length should be at most ${n}`)
			}
		})
	}

	above(n) {
		return this.addValidator((x, path) => {
			switch (type(x)) {
				case "Number":
					if (x <= n) throw new Error(`${path} should be above ${n}`)
				case "Array":
				case "String":
					if (x.length <= n) throw new Error(`${path}.length should be above ${n}`)
			}
		})
	}

	bellow(n) {
		return this.addValidator((x, path) => {
			switch (type(x)) {
				case "Number":
					if (x >= n) throw new Error(`${path} should be bellow ${n}`)
				case "Array":
				case "String":
					if (x.length >= n) throw new Error(`${path}.length should be bellow ${n}`)
			}
		})
	}

	between(a, b) {
		return this.addValidator((x, path) => {
			switch (type(x)) {
				case "Number":
					if (x < a || b < x) {
						throw new Error(`${path} should be between ${a} and ${b}`)
					}
				case "Array":
				case "String":
					if (x.length < a || b < x.length) {
						throw new Error(`${path}.length should be between ${a} and ${b}`)
					}
			}
		})
	}

	match(regexp) {
		return this.addValidator((x, path) => {
			if (!regexp.test(x)) {
				throw new Error(`${path} should match ${regexp}`)
			}
		})
	}

	notMatch(regexp) {
		return this.addValidator((x, path) => {
			if (regexp.test(x)) {
				throw new Error(`${path} should not match ${regexp}`)
			}
		})
	}


	validate(x) {
		this.validator.forEach(f => f(x, "It"))
		return true
	}

}

module.exports = new Schemable()

