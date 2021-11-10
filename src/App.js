/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-template-curly-in-string */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
import React, { Component } from "react";
import io from "socket.io-client";
import ScreenRecording from "./screenRecording";
import "./App.css";
import "reactjs-popup/dist/index.css";
// import FormButton from './formDisplay/FormButton';
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import config from "./config";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import imgawal from "./img/noimage.jpg";
import Form from "./component/form";
class App extends React.Component {
  constructor(props) {
    super(props);
    firebase.initializeApp(config);

    this.state = {
      recordingNumber: 0,
      show: false,
    };

    // https://reactjs.org/docs/refs-and-the-dom.html
    this.localVideoref = React.createRef();
    this.remoteVideoref = React.createRef();

    this.socket = null;
    this.candidates = [];
  }

  componentDidMount = () => {
    this.socket = io.connect("https://9b5a-202-169-232-143.ngrok.io/webrtcPeer", {
      path: "/webrtc",
      query: {},
    });

    this.socket.on("connection-success", (success) => {
      console.log(success);
    });

    this.socket.on("offerOrAnswer", (sdp) => {
      this.textref.value = JSON.stringify(sdp);

      // set sdp as remote description
      this.pc.setRemoteDescription(new RTCSessionDescription(sdp));
    });

    this.socket.on("candidate", (candidate) => {
      this.pc.addIceCandidate(new RTCIceCandidate(candidate));
    });

    // const pc_config = null

    const pc_config = {
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    };

    // https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection
    // create an instance of RTCPeerConnection
    this.pc = new RTCPeerConnection(pc_config);

    // triggered when a new candidate is returned
    this.pc.onicecandidate = (e) => {
      // send the candidates to the remote peer
      // see addCandidate below to be triggered on the remote peer
      if (e.candidate) {
        // console.log(JSON.stringify(e.candidate))
        this.sendToPeer("candidate", e.candidate);
      }
    };

    // triggered when there is a change in connection state
    this.pc.oniceconnectionstatechange = (e) => {
      console.log(e);
    };

    // triggered when a stream is added to pc, see below - this.pc.addStream(stream)
    // this.pc.onaddstream = (e) => {
    //   this.remoteVideoref.current.srcObject = e.stream
    // }

    this.pc.ontrack = (e) => {
      debugger;
      this.remoteVideoref.current.srcObject = e.streams[0];
    };

    // called when getUserMedia() successfully returns - see below
    // getUserMedia() returns a MediaStream object (https://developer.mozilla.org/en-US/docs/Web/API/MediaStream)
    const success = (stream) => {
      window.localStream = stream;
      this.localVideoref.current.srcObject = stream;
      this.pc.addStream(stream);
    };

    // called when getUserMedia() fails - see below
    const failure = (e) => {
      console.log("getUserMedia Error: ", e);
    };

    // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
    // see the above link for more constraint options
    const constraints = {
      // audio: true,
      video: true,
      audio: true,
      // video: {
      //   width: 1280,
      //   height: 720
      // },
      // video: {
      //   width: { min: 1280 },
      // }
      options: {
        mirror: true,
      },
    };

    // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
    navigator.mediaDevices.getUserMedia(constraints).then(success).catch(failure);
  };

  sendToPeer = (messageType, payload) => {
    this.socket.emit(messageType, {
      socketID: this.socket.id,
      payload,
    });
  };

  /* ACTION METHODS FROM THE BUTTONS ON SCREEN */

  createOffer = () => {
    console.log("Offer");

    // https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/createOffer
    // initiates the creation of SDP
    this.pc.createOffer({ offerToReceiveVideo: 1 }).then((sdp) => {
      // console.log(JSON.stringify(sdp))

      // set offer sdp as local description
      this.pc.setLocalDescription(sdp);

      this.sendToPeer("offerOrAnswer", sdp);
    });
  };

  // https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/createAnswer
  // creates an SDP answer to an offer received from remote peer
  createAnswer = () => {
    console.log("Answer");
    this.pc.createAnswer({ offerToReceiveVideo: 1 }).then((sdp) => {
      // console.log(JSON.stringify(sdp))

      // set answer sdp as local description
      this.pc.setLocalDescription(sdp);

      this.sendToPeer("offerOrAnswer", sdp);
    });
  };

  setRemoteDescription = () => {
    // retrieve and parse the SDP copied from the remote peer
    const desc = JSON.parse(this.textref.value);

    // set sdp as remote description
    this.pc.setRemoteDescription(new RTCSessionDescription(desc));
  };

  addCandidate = () => {
    this.candidates.forEach((candidate) => {
      console.log(JSON.stringify(candidate));
      this.pc.addIceCandidate(new RTCIceCandidate(candidate));
    });
  };

  state = {
    seen: false,
  };

  togglePop = () => {
    this.setState({
      seen: !this.state.seen,
    });
  };

  photos = () => {
    const storage = getStorage();
    getDownloadURL(ref(storage, "ektp.jpg"))
      .then((url) => {
        const imgEktp = document.getElementById("ektp");
        imgEktp.setAttribute("src", url);
      })
      .catch((e) => {
        console.log(e);
      });
    getDownloadURL(ref(storage, "selfieEktp.jpg"))
      .then((url) => {
        const imgSelfieEktp = document.getElementById("selfieEktp");
        imgSelfieEktp.setAttribute("src", url);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  render() {
    return (
      <div>
        <ScreenRecording screen={true} audio={true} downloadRecordingPath="Screen_Recording_Demo" downloadRecordingType="mp4" emailToSupport="nathanaelneria@gmail.com" />
        <div className="grid-container">
          <div>
            <video
              style={{
                width: 500,
                height: 300,
                // margin: 5,
                backgroundColor: "black",
              }}
              ref={this.localVideoref}
              autoPlay
              muted
            ></video>
          </div>
          <div>
            <video
              style={{
                width: 500,
                height: 300,
                // margin: 5,
                backgroundColor: "black",
              }}
              ref={this.remoteVideoref}
              autoPlay
            ></video>
          </div>
        </div>
        <div className="grid-container">
          <div>
            <img
              id="selfieEktp"
              src={imgawal}
              alt="No Image Available"
              style={{
                width: 400,
                height: 300,
                // margin: 5
              }}
            />
          </div>
          <div>
            <img
              id="ektp"
              src={imgawal}
              alt="No Image Available"
              style={{
                width: 400,
                height: 300,
                // margin: 5
              }}
            />
          </div>
        </div>
        <br />
        <div style={{ marginBottom: "-5rem", width: "30rem", display: "flex" }}>
          <button onClick={this.createOffer}>Offer</button>
          <button onClick={this.createAnswer}>Answer</button>

          <button onClick={this.photos}>Get Photos</button>
          <Form />

          {/* <FormButton/> */}
          {/* <div onClick = {this.togglePop}>
          <button>Form</button>
        </div>
        {this.state.seen ? <PopUp togglePop = {this.togglePop}/> : null} */}
        </div>
        <br />
        <textarea
          type="hidden"
          style={{ width: 450, height: 40, display: "none" }}
          ref={(ref) => {
            this.textref = ref;
          }}
        />
      </div>
    );
  }
}

export default App;
