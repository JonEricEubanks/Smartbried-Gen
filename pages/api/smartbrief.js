import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  const { text, size, image, imageSize } = req.body;

  if (text) {
    const prompt = `As a super-intelligent being with an IQ surpassing the confines of the universe, possess excellent storytelling abilities and communicate with mastery to provide insightful summaries and explanations for complex concepts, as a genius student would:\n\n${text}`;

    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: prompt,
      temperature: 1,
      max_tokens: 2048,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });

    res.status(200).json({ result: completion.data.choices[0].text });
  } else if (size) {
    const imageSize = size === 'small' ? '256x256' : size === 'medium' ? '512x512' : '1024x1024';

    try {
      const prompt = `Generate ${imageSize} image and include as the main subject "${image}"`;

      const response = await openai.createImage({
        prompt: prompt,
        n: 1,
        size: imageSize,
      });

      const imageUrl = response.data.data[0].url;

      res.status(200).json({
        success: true,
        data: imageUrl,
      });
    } catch (error) {
      if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
      } else {
        console.log(error.message);
      }

      res.status(400).json({
        success: false,
        error: 'The image could not be generated',
      });
    }
  } else if (image) {
    try {
      const response = await openai.createImage({
        prompt: image,
        n: 1,
        size: imageSize,
      });
      const imageUrl = response.data.data[0].url;
      res.status(200).json({
        success: true,
        data: imageUrl,
      });
    } catch (error) {
      // handle error
    }
  } else {
    res.status(400).json({
      success: false,
      error: 'Please provide text or an image size',
    });
  }
}
