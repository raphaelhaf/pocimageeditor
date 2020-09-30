import React, { useState } from "react";
import AvatarEditor from "react-avatar-editor";
import Avatar from "@material-ui/core/Avatar";
import Button from '@material-ui/core/Button';
import Slider from "@material-ui/core/Slider";
import {MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';

interface ImageProps{
  cropperOpen: boolean;
  img: any;
  zoom: number;
  croppedImg: string;
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  large: {
    width: "100px",
    height: "100px",
  },
}));

const App: React.FC = () =>{

    const classes = useStyles();

    let editor: AvatarEditor;

    const [state, setState] = useState<ImageProps>(
      {
        cropperOpen: false,
        img: null,
        zoom: 2,
        croppedImg: "http://www.fillmurray.com/400/400"
      } );


  const handleZoomSlider = (event: React.ChangeEvent<{}>, value: number | number[])=>{
    
    const zoom = typeof value === "object" ? value[0] : value;

    setState(state=> ({...state, zoom}));
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) =>{
    window.URL = window.URL || window.webkitURL;
    if(! event.target || !event.target.files || event.target.files.length === 0) 
      return;

    let url = window.URL.createObjectURL(event.target.files[0]);
    //ReactDom.findDOMNode(refs.in).value = "";
    setState(state => ({...state, img: url, cropperOpen: true})); 
  }

  const handleSave = () => {
    if (editor) {
      const canvasScaled = editor.getImageScaledToCanvas();
      const croppedImg = canvasScaled.toDataURL();

      setState(state=> ({...state, img: null, cropperOpen: false, croppedImg}));

    }
  }
  const handleCancel = ()=>{
    setState(state => ({ ...state, cropperOpen: false}));
  }

  const setEditorRef = (_editor: AvatarEditor)=>editor = _editor;
  
  const theme = createMuiTheme({
    /* tema para v1.x */
   });
    return (
      <MuiThemeProvider theme={theme}>
        <div style={{ height: 500 }}>
          <Avatar src={state.croppedImg} className={classes.large}/>
          <Button variant="contained"> 
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </Button>
          {state.cropperOpen && (
            <div
              className="cropper-wrapper"
              style={{
                position: "absolute",
                top: 0,
                width: "100%",
                height: "100%",
                background: "rgba(200,200,200,.8)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <AvatarEditor
                ref={setEditorRef}
                image={state.img}
                width={200}
                height={200}
                border={50}
                color={[255, 255, 255, 0.6]} // RGBA
                scale={state.zoom}
                rotate={0}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <label
                  style={{
                    fontSize: 12,
                    marginRight: 10,
                    paddingBottom: 22,
                    fontWeight: 600
                  }}
                >
                  Zoom
                </label>
                <Slider
                  min={1}
                  max={10}
                  step={0.1}
                  value={state.zoom}
                  onChange={handleZoomSlider}
                  style={{ width: 200 }}
                />
              </div>
              <div>
                <Button variant="contained"
                  onClick={handleCancel}
                >Cancel</Button>
                <Button variant="contained"
                  onClick={handleSave}>Confirm</Button>
              </div>
            </div>
          )}
        </div>
      </MuiThemeProvider>
    );
  }
export default App;