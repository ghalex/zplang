export const ex1 = String.raw`
  (def age: 37)
  (def age2: age - 7)
  (def fname: "Alex")
  (def lname: "Ghiura")
  (def name: fname + " " + lname)

  (print: age)
  (print: "name: " name)

  (price: "AAPL")
`

export const ex2 = String.raw`
  (def arr1: [1 2 3 4])   // define arr1 as array
  (print: arr1)

  (def msg: (str: "Last element" "is" (nth: -1 arr1)))
  (print: msg)
`

export const ex3 = String.raw`
  (def arr1: [1 2 3 4])
  (def first:
    (fn [arr]:
      (nth: 0 arr)
    )
  )

  (def last:
    (fn [arr]:
      (def age: 2)      // Multiple lines example
      (nth: -1 arr)     // Last line will be the return
    )
  )

  (print: (first: arr1))
  (print: (last: arr1))
`

export const ex4 = String.raw`
  (def ageAlex: 3)
  (def ageAndreea: 35)
  (def names: ["Alex" "Andreea" "Pop"])

  (print: "Length:" (length: names))
  (if [(length: names) > 10]:
    (print: "TRUE")
    (print: "FALSE")
  )
`
