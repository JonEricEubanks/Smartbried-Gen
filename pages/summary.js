import '@fortawesome/fontawesome-free/css/all.css';
import Head from 'next/head';
import React, { useState } from 'react';
import styles from './index.module.css';



export default function Home() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [inputType, setInputType] = useState('text');
  const [imageSize, setImageSize] = useState('medium');
  const [image, setImage] = useState('');
  const [prompt2, setPrompt2] = useState('');
  const [prompt3, setPrompt3] = useState('');
  const [numImages, setNumImages] = useState(1); 



 async function onSubmit(event) {
    event.preventDefault();
    if (loading) {
      return;
    }
    setLoading(true);
    setResult('');

    const payload = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    let resultText = '';

    const prompt = `As a super-intelligent being with an IQ surpassing the confines of the universe, possess excellent storytelling abilities and communicate with mastery to provide insightful summaries and explanations for complex concepts, as a genius student would:\n\n${text}`;
    const prompt2Value = `As a super-intelligent being with an IQ surpassing the confines of the universe, possess excellent storytelling abilities and communicate with mastery to provide insightful explanations for complex concepts, as a genius student would rewrite professionally :\n\n${prompt2}`;
    const prompt3Value = `As a super-intelligent being with an IQ surpassing the confines of the universe, I possess excellent storytelling abilities and can communicate with mastery. I will provide a detailed and constructive critique of the following text, evaluating its clarity, coherence, and effectiveness in conveying the intended message:\n\n${prompt2Value} Critique:`;

    if (inputType === 'text') {
      if (text) {
        payload.body = JSON.stringify({ text: prompt });

        const response = await fetch('/api/smartbrief', payload);
        const data = await response.json();
        resultText = "<h2>Summary:</h2>" + data.result.replace(/\n/g, '<br />');
      }

      if (prompt2) {
        payload.body = JSON.stringify({ text: prompt2Value });

        const prompt2Result = await fetch('/api/smartbrief', payload);
        const data2 = await prompt2Result.json();
        resultText += "<h2><br />Rephrase:</h2>" + (resultText ? '<br />' : '') + data2.result.replace(/\n/g, '<br />');
      }

      if (prompt2Value) {
        payload.body = JSON.stringify({ text: prompt3Value });

        const prompt3Result = await fetch('/api/smartbrief', payload);
        const data3 = await prompt3Result.json();
        resultText += "<h2><br />Critique:</h2>" + (resultText ? '<br />' : '') + data3.result.replace(/\n/g, '<br />');
      }

      setResult(resultText);
    } else if (inputType === 'image' ) {
      const size = imageSize === 'small' ? '256x256' : imageSize === 'medium' ? '512x512' : '1024x1024';
      payload.body = JSON.stringify({ size, image, numImages });

      const response = await fetch('/api/smartbrief', payload);
      const data = await response.json();
      if (data.success) {
        const imageUrls = Array.isArray(data.data) ? data.data.map((url) => `<img class="${styles.generatedImage}" src="${url}" alt="generated image" />`).join('') : `<img class="${styles.generatedImage}" src="${data.data}" alt="generated image" />`;
        setResult(imageUrls);
      } else {
        setResult('Failed to generate image');
      }
    }

    setLoading(false);
}

  
  
  

  return (
    <div className="APP" style={{ backgroundColor: "#282c34", minHeight: "100vh", minHeight:"100vh" ,top:0, bottom:0,right:0,left:0 }}>
    <h1 style={{ color: "white", position: "initial", padding: 20, textAlign: 'center', marginTop: "10px" }}>Smartbrief</h1>
    <div className={styles.resultContainer} style={{ fontFamily: "Lato, sans-serif" }}>
      {inputType === 'text' && (
        <div className={styles.textContainer}>

          <div dangerouslySetInnerHTML={{ __html: result }} />
        </div>
      )}
      {inputType === 'image' && result && (
        <div className={styles.imageContainer} dangerouslySetInnerHTML={{ __html: result }} style={{ color: "white" }}/>
      )}
    </div>


      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px' }}>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ color: 'white',fontFamily: "Lato, sans-serif"  }}>Your input is being analyzed, please wait a moment. </h3>
            <img src={`${window.location.origin}/baby.jpg`} style={{ width: '300px', height: '400px' }} />
          </div>
        </div>
      )}
      <form onSubmit={onSubmit} style={{ flexDirection: "column", alignItems: "center", width: "80%", marginTop: "10px", top: 0 }}>
      <div>
  <button type="button" className={styles.generatessummarybuttonstext} onClick={() => setInputType('text')}>
    <span style={{ fontSize: "16px", fontFamily: "Lato, sans-serif", fontWeight: "bold" }}>Text</span>
  </button>
  <button type="button" className={styles.generatessummarybuttonsimage} onClick={() => setInputType('image')}>
    <span style={{ fontSize: "16px", fontFamily: "Lato, sans-serif", fontWeight: "bold" }}>Image</span>
  </button>
</div>

        <div className="chat-input-textarea" style={{ position: 'relative' }}>
          {inputType === 'text' ? (
            <>
              <textarea
                className={styles.textareas}
                type="text"
                name="Text"
                placeholder="Enter text for summary"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <button
  type="button"
  className={`${styles.generatessummarybuttons} ${styles.submitButton}`}
  onClick={onSubmit}
>
  <i className="fa fa-search"></i>
</button>


       <textarea
       className={styles.textareas}
       type="text"
       name="Prompt2"
       placeholder="Provide the text to be reworded for emails"
       value={prompt2}
      onChange={(e) => setPrompt2(e.target.value)}
/>

{/* <textarea //!  Commented out for critique
  style={{
    margin: "10px",
    width: "100%",
    height: "70px",
    marginTop: "5px",
    marginLeft: "30px",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #C1C1C1",
    fontFamily: "Lato, sans-serif",
  }}
  type="text"
  name="Prompt3"
  placeholder="Provide the text to be critiqued"
  value={prompt3}
  onChange={(e) => setPrompt3(e.target.value)}
/> */}



            </>
          ) : (
            <div>
              <select className={styles.imagesize1} id="size" name="size" value={imageSize} onChange={(e) => setImageSize(e.target.value)}>
                <option className={styles.imagesize1} value="small">Small (256x256)</option>
                <option className={styles.imagesize1} value="medium">Medium (512x512)</option>
                <option className={styles.imagesize1} value="large">Large (1024x1024)</option>
              </select>
              <div>
              <select
  className={styles.imagesize1}
  id="numImages"
  name="numImages"
  value={numImages}
  onChange={(e) => setNumImages(e.target.value)}
>
  <option value="" disabled selected >
    Number of Images
  </option>
  <option className={styles.imagesize1} value="1">1</option>
  <option className={styles.imagesize1} value="2">2</option>
  <option className={styles.imagesize1} value="3">3</option>
</select>

</div>

              <input
                className={styles.textareasimg}
                type="text"
                name="Image"
                placeholder="Enter prompt for image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />

<button
  type="button"
  className={`${styles.generatessummarybuttons} ${styles.submitButtonImage}`}
  onClick={onSubmit}
>
  <i className="fa fa-search"></i>
</button>
            </div>
          )}
        </div>
      </form>
      <div style={{ backgroundColor: "white", fontFamily: "Lato, sans-serif" }}>
        <Head>
          <title>Smartbrief Text Summary / Image Generator</title>
          <link rel="icon" href="/baby.jpg" />
        </Head>
      </div>
    </div>
  );
}
