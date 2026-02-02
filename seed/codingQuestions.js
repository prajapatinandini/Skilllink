module.exports = [

  // ================= EASY =================

  {
    title: "Reverse a String",
    description: `
You are given a string S. Your task is to print the reverse of the string.

Input Format:
A single line containing string S.

Output Format:
Print the reversed string.

Constraints:
1 ≤ |S| ≤ 100000
    `,
    difficulty: "easy",
    topics: ["string"],
    languages: ["javascript", "python", "java"]
  },

  {
    title: "Second Largest Element",
    description: `
Given an array of integers, find the second largest DISTINCT element.

Input Format:
First line contains integer N.
Second line contains N space-separated integers.

Output Format:
Print the second largest element.

Constraints:
2 ≤ N ≤ 100000
    `,
    difficulty: "easy",
    topics: ["array"],
    languages: ["javascript", "python", "java"]
  },

  {
    title: "Check Palindrome",
    description: `
Given a string S, determine whether it is a palindrome.

A string is palindrome if it reads the same forwards and backwards.

Input Format:
A single line containing string S.

Output Format:
Print true or false.

Constraints:
1 ≤ |S| ≤ 100000
Case-insensitive.
    `,
    difficulty: "easy",
    topics: ["string"],
    languages: ["javascript", "python", "java"]
  },

  {
    title: "Factorial of Number",
    description: `
Given a non-negative integer N, print its factorial.

Input Format:
Single integer N.

Output Format:
Print factorial of N.

Constraints:
0 ≤ N ≤ 20
    `,
    difficulty: "easy",
    topics: ["math"],
    languages: ["javascript", "python", "java"]
  },

  // ================= HARD =================

  {
    title: "Detect Cycle in Linked List",
    description: `
Given a singly linked list, determine if it has a cycle in it.

Input Format:
Linked list nodes are given in order, special notation 'cycle' indicates cycle back.

Output Format:
Print true if cycle exists, false otherwise.
    `,
    difficulty: "hard",
    topics: ["linkedlist"],
    languages: ["javascript", "python", "java"]
  },

  {
    title: "LRU Cache Implementation",
    description: `
Implement an LRU Cache with get and put methods.

Input Format:
Sequence of operations (get, put) with key and value.

Output Format:
Return results of get operations.
    `,
    difficulty: "hard",
    topics: ["design", "hashmap"],
    languages: ["javascript", "python", "java"]
  },

  {
    title: "Merge K Sorted Lists",
    description: `
Given K sorted linked lists, merge them into one sorted linked list.

Input Format:
Each list is given as space-separated integers separated by '|'.

Output Format:
Print merged sorted list as space-separated integers.
    `,
    difficulty: "hard",
    topics: ["linkedlist", "heap"],
    languages: ["javascript", "python", "java"]
  },

  {
    title: "Binary Search",
    description: `
Given a sorted array and a target value, return its index. If target not found, return -1.

Input Format:
First line N.
Second line: sorted array of N integers.
Third line: target value.

Output Format:
Print index or -1.
    `,
    difficulty: "hard",
    topics: ["search"],
    languages: ["javascript", "python", "java"]
  }

];
