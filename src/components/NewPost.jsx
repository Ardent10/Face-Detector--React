import React,{useEffect,useRef, useState} from 'react';
import * as faceapi from "face-api.js";

const NewPost = ({image}) => {
    const {url, width, height} = image;

    const [faces,setFaces]      = useState([]);
    const [friends, setFriends] = useState([]);

    const imgRef    = useRef();
    const canvasRef = useRef();

    const handleImage= async () =>{
        
        const detections = await faceapi.detectAllFaces(
                imgRef.current,
                new faceapi.TinyFaceDetectorOptions());
            // .withFaceLandmarks()
            // .withFaceExpressions();

            console.log(detections);

            // canvasRef.current.innerHtml = faceapi.createCanvasFromMedia(imgRef.current);
            // faceapi.matchDimensions(canvasRef.current,{
            //     width,
            //     height,
            // })
            // const resized = faceapi.resizeResults(detections,{
            //     width,
            //     height,
            // })

            // faceapi.draw.drawDetections(canvasRef.current,resized);
            // faceapi.draw.drawFaceExpressions(canvasRef.current,resized);
            // faceapi.draw.drawFaceLandmarks(canvasRef.current,resized);

            setFaces(detections.map((d)=>Object.values(d.box)));
        };

        console.log(faces);

        const enter = () => {
            const ctx = canvasRef.current.getContext("2d");
            ctx.lineWidth = 5;
            ctx.strokeStyle = "blue";
            faces.map((face) => ctx.strokeRect(...face));
          };

                    
          useEffect(() => {
              const loadModels = () =>{
                  
                  Promise.all([
                      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
                      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
                      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
                      faceapi.nets.faceExpressionNet.loadFromUri("/models"),
                    ])
                    .then(handleImage)
                    .catch((err)=>(console.log(err)))
                };
                imgRef.current && loadModels();
            }, [])
            
        const addFriend = (e) =>{
            setFriends(prev=>({...prev, [e.target.name]: e.target.value}));
        }  

        console.log(friends);

    return (
        <div className='container'>
            
            <div className='left' style={{width,height}}>
                <img 
                    className='main-img' 
                    ref={imgRef} 
                    crossOrigin='anonymous' 
                    src={url} 
                    alt="" />
                <canvas 
                    onMouseEnter={enter} 
                    ref={canvasRef} 
                    width={width} 
                    height={height}/>
                
                {faces.map((face,i)=>(
                        <input 
                            name={`input${i}`}
                            style={{left: face[0], top: face[1] + face[3]+7}}
                            placeholder='Tag a friend'
                            key={i}
                            className='friendInput'
                            onChange={addFriend}
                        />
                ))}
            </div>

            <div className='right'>
                <h1 
                    style={{color:"#4064ac", marginBottom: "10px"}}
                    >Share your post </h1>
                <input 
                    type="text" 
                    placeholder='Whats on your mind?'
                    className="rightInput" 
                    id="" />
                {friends && (
                    <span className='friends'>
                        with  
                        <span className='name'> {Object.values(friends)+ "  "}</span></span>
                )}    
                <button className="rightButton">Send👻</button>

            </div>            
            {/* <img 
                src={image.url} 
                alt=""  
                style={{"width": "900px","height":"650px","margin":"15px"}}
            /> */}
        </div>
    )
}

export default NewPost
