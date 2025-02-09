import { Anthropic } from '@anthropic-ai/sdk';

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  if (!process.env.CLAUDE_API_KEY) {
    return res.status(500).json({ message: 'Claude API key is not configured' });
  }

  const { text } = req.body;
  
  if (!text) {
    return res.status(400).json({ message: 'No text provided' });
  }

  const anthropic = new Anthropic({
    apiKey: process.env.CLAUDE_API_KEY,
  });

  console.log('Received request with text:', text);
  console.log('API Key exists:', !!process.env.CLAUDE_API_KEY);

  try {
    console.log('Making request to Claude API...');
    const message = await anthropic.messages.create({
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `Please remix the following text in a creative way: ${text}`,
      }],
      model: 'claude-3-sonnet-20240229',
    });

    console.log('Claude API Response:', JSON.stringify(message, null, 2));
    return res.status(200).json({ remixedText: message.content[0].text });
  } catch (error) {
    console.error('Claude API Error:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data
    });
    
    return res.status(500).json({ 
      message: 'Error processing your request',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      response: error.response?.data
    });
  }
}

export default handler; 