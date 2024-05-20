
import React, { useState, useRef, useEffect } from 'react';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { BeatLoader } from 'react-spinners';


function App() {
  const [model, setModel] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [flexDirection, setFlexDirection] = useState('row');
  const [gap, setGap] = useState(100);
  const imageRef = useRef(null);

  useEffect(() => {
    const loadModel = async () => {
      console.log('Loading model...');
      const loadedModel = await mobilenet.load();
      console.log('Model loaded:', loadedModel);
      setModel(loadedModel);
    };
    loadModel();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if(window.innerWidth <= 500) {
        setFlexDirection('column');
        setGap(10)
      } else {
        setFlexDirection('row');
        setGap(100)
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    }

  }, []);
  

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = async () => {
          imageRef.current.src = img.src;
          // Check if the model is available
          if (model) {
            const predictions = await model.classify(imageRef.current);
            setPredictions(predictions);
          } else {
            console.log('Model is not yet available');
          }
        };
      };
      reader.readAsDataURL(file);
    }
  };
  
  const imageHeight = imageRef.current && imageRef.current.src ? '300px' : '0px ';
  const imageDisplay = imageRef.current && imageRef.current.src ? 'block' : 'none';
  const resultBackground = imageRef.current && imageRef.current.src ? 'whitesmoke' : 'none';
  const resultPadding = imageRef.current && imageRef.current.src ? '10px 20px' : '0';
  

  return (
    <div style={{display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems:'center', height: '100vh', width: '100vw'}}>
      <h1 className="responsive-heading">AI Image Classification</h1>
      {!model && 
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <h3 style={{fontFamily: 'monospace'}}>Model is loading</h3>
        <BeatLoader color="#000" loading={true} size={12} />
      </div>}
      {model &&  <div style={{display: 'flex', justifyContent: 'center', marginTop: '20px', alignItems: 'center', gap: gap, flexDirection: flexDirection}}>
        <label htmlFor="file-upload" className='button'>Upload Image</label>
         <input id="file-upload" type="file" accept="image/*" onChange={handleImageChange} style={{display:'none'}}/>
         <img ref={imageRef} alt="Upload" style={{ maxWidth: '300px', height: imageHeight, display: imageDisplay }} />
       </div>}
      <ul style={{backgroundColor: resultBackground, padding: resultPadding, listStyleType: 'none', lineBreak: '5px'}}>
        {predictions.map((prediction, index) => (
          <li key={index} style={{fontFamily:'verdana'}}>
         : There are <strong>{(prediction.probability * 100).toFixed(2)}% </strong> chances that it is a {prediction.className[0].toUpperCase() + prediction.className.slice(1)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
