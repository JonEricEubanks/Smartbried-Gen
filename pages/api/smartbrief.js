import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  const { text, prompt2, prompt3, size, image, imageSize, input } = req.body;
  const numImages = parseInt(req.body.numImages);

  if (text || prompt2 || prompt3 || input) {
    const promptText = text ? text : input;
    const promptPrefix = text
      ? `As a super-intelligent communicator, I excel at summarizing complex concepts with genius-level insight and I will generate a summary that is both accurate and professional:`
      : prompt2
      ? `As a super-intelligent communicator, I excel at summarizing complex concepts with genius-level insight and I will rewrite more professionally for an email:`
      : `As a super-intelligent communicator, I excel at summarizing complex concepts with genius-level insight. I will provide a detailed and constructive critique of the following text, evaluating its clarity, coherence, and effectiveness in conveying the intended message:`;

    const prompt = `${promptPrefix}\n\n${promptText}`;

    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: prompt,
      temperature: 1,
      max_tokens: 2048,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      best_of: 2,
    });

    return res.status(200).json({ result: completion.data.choices[0].text });
  }
 else if (size) {
    const imageSize = size === 'small' ? '256x256' : size === 'medium' ? '512x512' : size === 'large' ? '1024x1024' : '512x512';


    try {
      const prompt = `Generate a stunning realistic ${imageSize} images and include "${image}" as the main subject. The image should be composed in such a way that the viewer is drawn to the beauty of the image and they can take their eyes away bc it looks so realistic to them.`;

      const response = await openai.createImage({
        prompt: prompt,
        n: numImages || 1,
        size: size,
      });

      console.log('Input image imageSize:',imageSize);
      console.log('Input number:',numImages);
      
      
      const imageUrls = response.data.data.map((img) => img.url);

      res.status(200).json({
        success: true,
        data: imageUrls,
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
      const model = 'image-alpha-001';
      const response = await openai.createImage({
        prompt: image,
        n:  numImages || 1,
        size: imageSize,
        model: model,
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
