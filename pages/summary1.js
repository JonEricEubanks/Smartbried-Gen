import Head from 'next/head'; // Import Head component from Next.js for setting the document head
import React from 'react'; // Import React module
import React, { useState } from 'react'; // Import useState hook from React for managing component state
import styles from './index.module.css'; // Import CSS styles

export default function Home() {
  const [text, settext] = useState(''); // Declare state variable for input text and setter function
  const [loading, setLoading] = useState(false); // Declare state variable for loading status and setter function
  const [result, setResult] = useState(''); // Declare state variable for the generated summary and setter function
  const [inputType, setInputType] = useState('text'); // Declare state variable for the input type (text or image) and setter function
  const [imageSize, setImageSize] = useState('medium'); // Declare state variable for the selected image size and setter function
  const [image, setImage] = useState ('');
  
  async function onSubmit(event) {
    event.preventDefault();
    if (loading) {
      return;
    }
    setLoading(true);
    setResult('');
    console.log('Input text:', text); // logs the "text" variable
    console.log('Input size:', imageSize); // logs the "imageSize" variable
    console.log('Input image:', image); // logs the "image" variable, which should have a value when the user selects the "image" input type
    if (inputType === 'text') {
      console.log('Image size:', imageSize); // add a console log statement to output the "imageSize" variable value
      const prompt = `As a super-intelligent being with an IQ surpassing the confines of the universe, possess excellent storytelling abilities and communicate with mastery to provide insightful summaries and explanations for complex concepts, as a genius student would:\n\n${text}`;
      const response = await fetch('/api/smartbrief', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: prompt,
        }),
      });
      const data = await response.json();
      setResult(data.result.replace(/\n/g, '<br />'));
    } else {
      const size = imageSize === 'small' ? '256x256' : imageSize === 'medium' ? '512x512' : '1024x1024';
      const numImages = 3; // set the number of images to 3
      const response = await fetch('/api/smartbrief', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          size: size,
          image: image, // add the "image" variable to the request body
          numImages: numImages, // add the "numImages" variable to the request body
        }),
      });
      const data = await response.json();
      if (data.success) {
        let imageUrls = '';
        if (Array.isArray(data.data)) {
          imageUrls = data.data.map((url) => `<img src="${url}" alt="generated image" />`).join('');
        } else if (typeof data.data === 'string') {
          imageUrls = `<img src="${data.data}" alt="generated image" />`;
        }
        setResult(imageUrls); // set the image tags to the "result" state
      } else {
        setResult('Failed to generate image');
      }
    }
    setLoading(false);
  }
  
  

  return (

    <div style={{ backgroundColor: "white",fontFamily: "Lato, sans-serif" }}>
      <Head>
        <title>Smartbrief Text Summary / Image Generator</title>
        <link rel="icon" href="/Gins.jpg" />
      </Head>

      <div
        style={{  marginTop: "30px",width: '80%', padding: "60px", color: 'black',textAlign: 'center', backgroundColor: 'white', borderRadius: '5px'}}
        dangerouslySetInnerHTML={{ __html: result }}//text summary
      />
<div children="sidemenu"></div>
      <main
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "10px",
        }}
      >
        <h1 style={{ color: "black", position: "absolute", top: 0, textAlign: 'center'}}>Smartbrief</h1>
        <form
          onSubmit={onSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "80%",
            marginTop: "10px",
            top: 0,
          }}
        >
          <div>
            <button
              type="button"
              style={{
                width: "50%",
                height: "40px",
                marginTop: "20px",
                backgroundColor: "#3F3F3F",
                color: "#e3e4e6",
                borderRadius: "5px",
                border: "none",
                marginRight: "5px",
              }}
              onClick={() => setInputType('text')}
            >
              <span style={{fontSize: "16px",fontFamily: "Lato, sans-serif", fontWeight: "bold"}}>Text</span>
            </button>
            <button
              type="button"
              style={{
                width: "50%",
                height: "40px",
                marginTop: "20px",
                backgroundColor: "#3F3F3F",
                color: "#e3e4e6",
                borderRadius: "5px",
                border: "none",
                marginLeft: "5px",
              }}
              onClick={() => setInputType('image')}
            >
              <span style={{fontSize: "16px",fontFamily: "Lato, sans-serif", fontWeight: "bold"}}>Image</span>
            </button>
          </div>
      
          {inputType === 'text' ? (
            <textarea
              style={{
                width: "100%",
                height: "100px",
                marginTop: "10px",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #C1C1C1",
                fontFamily: "Lato, sans-serif",
              }}
              type="text"
              name="Text"
              placeholder="Enter text for summary"
              value={text}
              onChange={(e) => settext(e.target.value)}
            />
          ) : (
            <div>
              <input
                style={{
                  width: "100%",
                  height: "40px",
                  marginTop: "15px",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #C1C1C1",
                  fontFamily: "Lato, sans-serif",
                }}
                type="text"
                name="Image"
                placeholder="Enter prompt for image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
                {/* Add size selector */}
        <div style={{ marginTop: "10px" }}>
  <label htmlFor="size" style={{ fontSize: "16px", fontWeight: "regular",fontFamily: "Lato, sans-serif", marginRight: "10px" }}>
    Image size:
  </label>
  <select
    id="size"
    name="size"
    fontFamily= "Lato, sans-serif"
    value={imageSize}
    onChange={(e) => setImageSize(e.target.value)}
    style={{
      width: "100%",
      height: "40px",
      padding: "10px",
      borderRadius: "5px",
      border: "1px solid #C1C1C1",
    }}
  >
    <option value="small">Small (256x256)</option>
    <option value="medium">Medium (512x512)</option>
    <option value="large">Large (1024x1024)</option>
  </select>
  
</div>
              </div>
            )}
  
            <button
              type="submit"
              style={{
                width: "100%",
                height: "40px",
                marginTop: "20px",
                backgroundColor: "#3F3F3F",
                color: "#e3e4e6",
                borderRadius: "5px",
                border: "none",
                fontWeight: "bold",
              }}
            >
              Generate Summary
            </button>
          </form>
          {loading && (
  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center',backgroundColor: 'white', marginTop: '10px'}}>
    <h3 style={{color: 'black'}}>Looking for the best summary... </h3>
    <img src={`${window.location.origin}/Devon.jpg`} style={{width: '400px', height: '450px'}} />
  </div>
)}

        </main>
      </div>
    );
  }
  