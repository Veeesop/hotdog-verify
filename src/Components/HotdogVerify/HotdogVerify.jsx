import React, { useState, useEffect, useRef } from "react";
import * as mobileNet from "@tensorflow-models/mobilenet";
import Rating from '@mui/material/Rating'
import { GiHotDog } from 'react-icons/gi'
import Webcam from "react-webcam";
import TagsContainer from "../TagsContainer/TagsContainer";
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Paper from '@mui/material/Paper'
import '@tensorflow/tfjs-backend-webgl'
import './HotdogVerify.css'



const HotdogVerify = () => {
    //tensorflowjs model
    const [model, setModel] = useState(null);
    const [image, setImage] = useState('');
    const [isHotdog, setIsHotdog] = useState(false)
    const [predictions, setPredictions] = useState([]);
    const webcamRef = React.useRef(null);
    const canvasRef = useRef(null);
    
    //converts image to canvas so it can be analyzed 
    const onImageChange = async ({ target }) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        drawImageOnCanvas(target, canvas, ctx);
    
        const predictions = await model.classify(canvas, 1);
        console.log(predictions)
        setPredictions(predictions);
      };
    //adds canvas
    const drawImageOnCanvas = (image, canvas, ctx) => {
        const naturalWidth = image.naturalWidth;
        const naturalHeight = image.naturalHeight;
        canvas.width = image.width;
        canvas.height = image.height;
    
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        const isLandscape = naturalWidth > naturalHeight;
        ctx.drawImage(
          image,
          isLandscape ? (naturalWidth - naturalHeight) / 2 : 0,
          isLandscape ? 0 : (naturalHeight - naturalWidth) / 2,
          isLandscape ? naturalHeight : naturalWidth,
          isLandscape ? naturalHeight : naturalWidth,
          0,
          0,
          ctx.canvas.width,
          ctx.canvas.height
        );
      };      
      //turns base64 image into blob for easier use
    const dataURItoBlob = (dataURI) =>{
        let byteString = atob(dataURI.split(',')[1]);
      
        // separate out the mime component
        let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
      
        let ab = new ArrayBuffer(byteString.length);
        let ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        let blob = new Blob([ab], {type: mimeString});
        return blob;
      }

    const videoConstraints = {
        width: 400,
        height: 400,
        facingMode: "user"
      };

    const renderInput = () => (
        !image &&
            <>
                <Webcam
                        audio={false}
                        height={400}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        width={400}
                        videoConstraints={videoConstraints}
                        className='classified-image'
                        />
                <h3>Verify Your Dog!</h3>
                <Button onClick={capture} variant="contained">Capture photo</Button>
            </>
            
      );
    
    const renderPreview = () => (
        image &&
        <div className="classified-image">
        <canvas ref={canvasRef}>
          <img alt="preview"  src={image} onLoad={onImageChange}/>
        </canvas>
        <Button onClick={clear} variant="contained">Retake</Button>
        </div>
        
      );

    const clear = () => {
        setImage('')
      }

    const capture = React.useCallback(
        () => {
          const imageSrc = webcamRef.current.getScreenshot();
          const imageBlob = dataURItoBlob(imageSrc);
          const imageUrl = URL.createObjectURL(imageBlob);
          setImage(imageUrl)
        },
        [webcamRef]
      );
        //loads tensor flow model on page load
      useEffect(() => {
        const loadModel = async () => {
          const model = await mobileNet.load();
          setModel(model);
        };
        loadModel();
      }, []);
    
    return (
        <div className="hotdog-verify-image">
        <h1>HotDog Verifier</h1>
        {renderInput()}
        {renderPreview()}
        {!!predictions.length && <TagsContainer predictions={predictions} />}
        <Rating 
            size='large'
            icon={<GiHotDog />}
            emptyIcon={<GiHotDog />}
            sx={{
                fontSize: "4rem"
            }}
            onChange={()=>{}}
        />
        <TextField
          id="Description"
          label="Description"
          placeholder="Description"
          sx={{ m: 1, width: '30ch' }}
          rows={4}
          multiline
        />
        {isHotdog && 
        <Button sx={{ m: 1, width: '20ch' }} variant="contained">Add HotDog!</Button>
        }
        <Paper elevation={3}/>
        </div>
    )
}

export default HotdogVerify