import { PlayArrow, RecordVoiceOver, Stop } from '@mui/icons-material';
import { IconButton, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';

const RecordAudioBetter = ({id}: {id?: string}) => {
  const recorderControls = useAudioRecorder(),
  //@ts-ignore
//   const addAudioElement = (blob) => {
//     const url = URL.createObjectURL(blob);
//     const audio = document.createElement("audio");
//     audio.src = url;
//     audio.controls = true;
//     document.body.appendChild(audio);
//   },
  [isPlaying, setIsPlaying] = useState(false),
  handleRecord = () => {
    if (!recorderControls.isRecording) {
        recorderControls.startRecording()
    }
  },
  handleStopRecording = () => {
    if (recorderControls.isRecording) {
        recorderControls.stopRecording()
    }
  },
  handlePlayAudio = () => {
    isPlaying && console.log(JSON.stringify(recorderControls.recordingBlob))
  }

//   {/* <AudioRecorder 
//         onRecordingComplete={ 
//             //@ts-ignore
//             (blob) => addAudioElement(blob)}
//         // recorderControls={recorderControls}
//         audioTrackConstraints={{
//             noiseSuppression: true,
//             echoCancellation: true,
//         }} 
//         downloadOnSavePress={true}
//         downloadFileExtension="webm"
//       /> */}

//       {/* <button onClick={recorderControls.stopRecording}>Stop recording</button> */}
//     {/* </div> */}
  return <Stack direction="row">
        {<IconButton  onClick={handlePlayAudio}> 
            {/* disabled={!audioUrl || !isRecording} //handlePlay(): handleStop()*/}
                {isPlaying ? <Stop/> : <PlayArrow/> }</IconButton>
            }
        <Stack direction='column'>
            <IconButton onMouseDown={handleRecord}
            onMouseUp={handleStopRecording}><RecordVoiceOver/></IconButton>
            {/* disabled={isRecording} */}
            <Typography>{recorderControls.recordingTime}</Typography>
            <Typography>Hold Spacebar or click and hold to record</Typography>
        </Stack>
    </Stack>
}

export default RecordAudioBetter