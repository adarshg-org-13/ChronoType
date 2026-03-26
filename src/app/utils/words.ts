// Sentences page you can edit the words easily by writing in the setences list
export const SENTENCES = [
  "The quick brown fox jumps over the lazy dog.",
  "A journey of a thousand miles begins with a single step.",
  "To be or not to be, that is the question.",
  "All that glitters is not gold.",
  "I think, therefore I am.",
  "The only thing we have to fear is fear itself.",
  "That's one small step for man, one giant leap for mankind.",
  "If you want to know what a man's like, take a good look at how he treats his inferiors, not his equals.",
  "In the end, it's not the years in your life that count. It's the life in your years.",
  "You miss 100% of the shots you don't take.",
  "Whether you think you can or you think you can't, you're right.",
  "I have learned over the years that when one's mind is made up, this diminishes fear.",
  "The only limit to our realization of tomorrow will be our doubts of today.",
  "What you get by achieving your goals is not as important as what you become by achieving your goals.",
  "Believe you can and you're halfway there.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "It is our choices, that show what we truly are, far more than our abilities.",
  "There is no greater agony than bearing an untold story inside you.",
  "Everything you can imagine is real.",
  "Do what you can, with what you have, where you are.",
  "Life is what happens when you're busy making other plans.",
  "The future belongs to those who believe in the beauty of their dreams.",
  "Tell me and I forget. Teach me and I remember. Involve me and I learn.",
  "The best and most beautiful things in the world cannot be seen or even touched - they must be felt with the heart.",
  "It is during our darkest moments that we must focus to see the light.",
  "Whoever is happy will make others happy too.",
  "Do not go where the path may lead, go instead where there is no path and leave a trail."
];

export const generateWords = (count: number = 500) => {
  const words: string[] = [];
  while (words.length < count) {
    const randomSentence = SENTENCES[Math.floor(Math.random() * SENTENCES.length)];
    // Remove all non-alphabetical characters (numbers, special chars) and convert to lowercase
    const cleanSentence = randomSentence.toLowerCase().replace(/[^a-z\s]/g, '');
    const sentenceWords = cleanSentence.split(/\s+/).filter(w => w.length > 0);
    words.push(...sentenceWords);
  }
  return words.slice(0, count);
};
