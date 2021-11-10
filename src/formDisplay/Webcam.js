import React, { useState } from 'react'
import Webcam from 'react-webcam'
import firebase from 'firebase'

// eslint-disable-next-line no-unused-vars
const WebcamComponent = () => <Webcam/>

const videoConstraints = {
  width: 220,
  height: 200,
  facingMode: 'user'
}

const WebcamCapture = () => {
  const webcamRef = React.useRef(null)

  const [image, setImage] = useState('')

  const capture = React.useCallback(
    () => {
      const imageSrc = webcamRef.current.getScreenshot()

      setImage(imageSrc)

      // let file = image
      var storage = firebase.storage()
      const base64String = imageSrc.split(',')[1]
      storage
        .ref('FormPhotos/user.jpeg')
        .putString(base64String, 'base64', { contentType: 'image/jpeg' })
        .then(() => {
          console.log('Image uploaded')
        }).catch((e) => console.log(e))
    },
    [webcamRef]
  )

  return (
    <div className = 'webcam-container'>
      <div className = 'webcam-img'>
        {
          // eslint-disable-next-line eqeqeq
          image == '' ? <Webcam
            audio = {false}
            height = {200}
            ref = {webcamRef}
            screenshotFormat = 'image/jpeg'
            width = {220}
            videoConstraints = {videoConstraints}
          /> : <img src = {image}/>}
      </div>
      <div>
        {
          // eslint-disable-next-line eqeqeq
          image != ''

            ? <button onClick = {(e) => {
              e.preventDefault()
              setImage('')
            }} className = 'webcam-btn'>
            Retake Image
            </button>
            : <button onClick = {(e) => {
              e.preventDefault()
              capture()
            }}>Capture</button>
        }
      </div>
    </div>
  )
}

export default WebcamCapture
