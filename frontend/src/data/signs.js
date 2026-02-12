// src/data/signs.js

import Apple from "../assets/signs/apple.mp4";
import Banana from "../assets/signs/banana.mp4";
import Bread from "../assets/signs/bread.mp4";
import Cheese from "../assets/signs/cheese.mp4";
import Milk from "../assets/signs/milk.mp4";

import Dog from "../assets/signs/dog.mp4";
import Cat from "../assets/signs/cat.mp4";
import Bird from "../assets/signs/bird.mp4";
import Fish from "../assets/signs/fish.mp4";
import Horse from "../assets/signs/horse.mp4";

import Eat from "../assets/signs/eat.mp4";
import Drink from "../assets/signs/drink.mp4";
import Sleep from "../assets/signs/sleep.mp4";
import Wash from "../assets/signs/wash.mp4";
import ThankYou from "../assets/signs/thank_you.mp4";

import Sun from "../assets/signs/sun.mp4";
import Rain from "../assets/signs/rain.mp4";
import Tree from "../assets/signs/tree.mp4";
import Flower from "../assets/signs/flower.mp4";
import Wind from "../assets/signs/wind.mp4";

import Bus from "../assets/signs/bus.mp4";
import Train from "../assets/signs/train.mp4";
import Car from "../assets/signs/Car.mp4";
import Airport from "../assets/signs/airport.mp4";
import Ticket from "../assets/signs/ticket.mp4";

const signs = [
  // Food Land 🍎
  { id: 1, land: 1, word: "Apple", video: Apple, correctAnswer: "Apple", hint: "Crunchy, juicy, doctors say 'an ___ a day keeps me busy!'" },
  { id: 2, land: 1, word: "Banana", video: Banana, correctAnswer: "Banana", hint: "Ziggy LOVES this yellow snack. Watch out for the peel!" },
  { id: 3, land: 1, word: "Bread", video: Bread, correctAnswer: "Bread", hint: "Soft, warm, perfect for sandwiches. Sometimes a loaf of happiness!" },
  { id: 4, land: 1, word: "Cheese", video: Cheese, correctAnswer: "Cheese", hint: "Smelly? Maybe. Delicious? Definitely. Say '___' for the camera!" },
  { id: 5, land: 1, word: "Milk", video: Milk, correctAnswer: "Milk", hint: "White, creamy, and Ziggy drinks this before a happy dance!" },

  // Animal Kingdom 🐶
  { id: 6, land: 2, word: "Dog", video: Dog, correctAnswer: "Dog", hint: "Barks a lot and wags its tail. Best friend alert!" },
  { id: 7, land: 2, word: "Cat", video: Cat, correctAnswer: "Cat", hint: "Snoozy, purry, and sometimes knocks things down!" },
  { id: 8, land: 2, word: "Bird", video: Bird, correctAnswer: "Bird", hint: "Flies high and sometimes sings in the morning." },
  { id: 9, land: 2, word: "Fish", video: Fish, correctAnswer: "Fish", hint: "Lives in water, not a cat, not a dog. Swim swim!" },
  { id: 10, land: 2, word: "Horse", video: Horse, correctAnswer: "Horse", hint: "Gallops in fields, neighs, and loves carrots!" },

  // Daily Life 🏠
  { id: 11, land: 3, word: "Eat", video: Eat, correctAnswer: "Eat", hint: "Ziggy gets hangry if you forget this one!" },
  { id: 12, land: 3, word: "Drink", video: Drink, correctAnswer: "Drink", hint: "Water, juice, or soda. Stay hydrated!" },
  { id: 13, land: 3, word: "Sleep", video: Sleep, correctAnswer: "Sleep", hint: "Nighty night. Pillow and blanket required!" },
  { id: 14, land: 3, word: "Wash", video: Wash, correctAnswer: "Wash", hint: "Soap + water = happy Ziggy hands!" },
  { id: 15, land: 3, word: "Thank You", video: ThankYou, correctAnswer: "Thank You", hint: "Politeness points! Say it with your hands." },

  // Nature 🌳
  { id: 16, land: 4, word: "Sun", video: Sun, correctAnswer: "Sun", hint: "Bright, hot, and makes sunglasses necessary!" },
  { id: 17, land: 4, word: "Rain", video: Rain, correctAnswer: "Rain", hint: "Umbrella time! Don’t get soaked!" },
  { id: 18, land: 4, word: "Tree", video: Tree, correctAnswer: "Tree", hint: "Leaves, trunk, shade… home for birds!" },
  { id: 19, land: 4, word: "Flower", video: Flower, correctAnswer: "Flower", hint: "Pretty, colorful, and bees love it!" },
  { id: 20, land: 4, word: "Wind", video: Wind, correctAnswer: "Wind", hint: "Blows your hair around, sometimes brings kites flying!" },

  // Travel ✈️
  { id: 21, land: 5, word: "Bus", video: Bus, correctAnswer: "Bus", hint: "Big, yellow, stops at many places. Hop in!" },
  { id: 22, land: 5, word: "Train", video: Train, correctAnswer: "Train", hint: "Choo choo! Tracks ahead!" },
  { id: 23, land: 5, word: "Car", video: Car, correctAnswer: "Car", hint: "Hail it, ride it!" },
  { id: 24, land: 5, word: "Airport", video: Airport, correctAnswer: "Airport", hint: "Where planes take off… and luggage goes missing sometimes!" },
  { id: 25, land: 5, word: "Ticket", video: Ticket, correctAnswer: "Ticket", hint: "You need this to board. Keep it safe!" },
];

export default signs;
