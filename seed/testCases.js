module.exports = [

  // Reverse String
  {
    questionTitle: "Reverse a String",
    cases: [
      { input: "hello", output: "olleh" },
      { input: "follow", output: "wollof" },
      { input: "abcdef", output: "fedcba" }
    ]
  },

  // Second Largest
  {
    questionTitle: "Second Largest Element",
    cases: [
      { input: "5\n10 5 8 20 20", output: "10" },
      { input: "4\n1 2 3 4", output: "3" },
      { input: "3\n100 50 25", output: "50" }
    ]
  },

  // Check Palindrome
  {
    questionTitle: "Check Palindrome",
    cases: [
      { input: "madam", output: "true" },
      { input: "Racecar", output: "true" },
      { input: "hello", output: "false" }
    ]
  },

  // Factorial
  {
    questionTitle: "Factorial of Number",
    cases: [
      { input: "5", output: "120" },
      { input: "0", output: "1" },
      { input: "3", output: "6" }
    ]
  },

  // Detect Cycle
  {
    questionTitle: "Detect Cycle in Linked List",
    cases: [
      { input: "1 2 3 cycle", output: "true" },
      { input: "1 2 3 4", output: "false" }
    ]
  },

  // LRU Cache
  {
    questionTitle: "LRU Cache Implementation",
    cases: [
      { input: "put 1 1, put 2 2, get 1", output: "1" },
      { input: "put 1 1, put 2 2, put 3 3, get 2", output: "-1" }
    ]
  },

  // Merge K Sorted Lists
  {
    questionTitle: "Merge K Sorted Lists",
    cases: [
      { input: "1 4 5 | 1 3 4 | 2 6", output: "1 1 2 3 4 4 5 6" }
    ]
  },

  // Binary Search
  {
    questionTitle: "Binary Search",
    cases: [
      { input: "5\n1 2 3 4 5\n4", output: "3" },
      { input: "5\n1 2 3 4 5\n10", output: "-1" }
    ]
  }

];
