/**
 * cli-test.js
 * Simple interactive CLI client for testing the DLS AI Chatbot
 */

const readline = require('readline');
const http = require('http');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const PORT = process.env.PORT || 5100;
const API_URL = `http://localhost:${PORT}/api/ai/chat`;

if (!process.env.JWT_SECRET) {
  console.error('❌ JWT_SECRET is not set in your .env file. Set it before running cli-test.js.');
  process.exit(1);
}
const JWT_SECRET = process.env.JWT_SECRET;

// Create a test JWT token
const testToken = jwt.sign(
  { id: 'user123', name: 'Test User' },
  JWT_SECRET,
  { expiresIn: '1h' }
);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function sendMessage(message) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      message: message,
      context: {
        currentTopic: 'boolean-algebra',
        difficulty: 'beginner',
      },
    });

    const options = {
      hostname: 'localhost',
      port: PORT,
      path: '/api/ai/chat',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'Authorization': `Bearer ${testToken}`,
      },
    };

    const req = http.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          if (res.statusCode === 200) {
            resolve(parsed.reply);
          } else {
            reject(parsed.error || 'Unknown error');
          }
        } catch (err) {
          reject('Failed to parse response: ' + responseData);
        }
      });
    });

    req.on('error', (err) => {
      reject(`Connection error: ${err.message}`);
    });

    req.write(data);
    req.end();
  });
}

function promptUser() {
  rl.question('\n📚 You: ', async (input) => {
    if (input.toLowerCase() === 'exit' || input.toLowerCase() === 'quit') {
      console.log('\n👋 Goodbye!');
      rl.close();
      return;
    }

    if (!input.trim()) {
      promptUser();
      return;
    }

    try {
      console.log('\n⏳ DLS Mentor is thinking...');
      const reply = await sendMessage(input);
      console.log('\n🤖 DLS Mentor:', reply);
      promptUser();
    } catch (err) {
      console.error('\n❌ Error:', err);
      promptUser();
    }
  });
}

console.log('╔════════════════════════════════════════╗');
console.log('║   DLS AI Chatbot - Interactive CLI     ║');
console.log('╚════════════════════════════════════════╝');
console.log('\n📖 Topic: Boolean Algebra');
console.log('🎓 Difficulty: Beginner');
console.log('\nType your question and press Enter.');
console.log('Type "exit" or "quit" to leave.\n');

promptUser();
