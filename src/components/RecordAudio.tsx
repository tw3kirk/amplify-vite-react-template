import { IsoRounded, PlayArrow, RecordVoiceOver, Stop } from "@mui/icons-material"
import { IconButton, Stack, Typography } from "@mui/material"
import React, { useEffect, useRef, useState } from "react"

const RecordAudio = ({id}: {id?: string}) => {
    const [isRecording, setIsRecording] = useState(false),
        [isPlaying, setIsPlaying] = useState(false),
        [audioUrl, setAudioUrl] = useState<string>(),
        [audio, setAudio] = useState<HTMLAudioElement>(),
        [permission, setPermission] = useState<boolean>(),
        mediaRecorderRef = useRef(null),
        audioChunksRef = useRef([]),
        handleRequestPermission = async () => {
            try {
                await navigator.mediaDevices.getUserMedia({ audio: true });
                setPermission(true);
            } catch (err) {
                setPermission(false);
                alert("Microphone access denied.")
            }
        },
        handleRecord = async () => {
            if (isRecording) return

            if (permission !== true) {
                await handleRequestPermission()
                //@ts-ignore fix this later
                if (permission !== true) return
            }
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            audioChunksRef.current = []
            const mediaRecorder = new window.MediaRecorder(stream)
            //@ts-ignore fix this later
            mediaRecorderRef.current = mediaRecorder

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    //@ts-ignore
                    audioChunksRef.current.push(e.data)
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: "audio/webm" })
                console.log(blob)
                const url = URL.createObjectURL(blob)
                setAudioUrl(url)
                stream.getTracks().forEach((track) => track.stop())
            };

            mediaRecorder.start()
            setIsRecording(true)
            setAudioUrl(undefined)
        },
        handleStopRecording = () => {
            if (mediaRecorderRef.current && isRecording) {
                //@ts-ignore
                mediaRecorderRef.current.stop()
                setIsRecording(false)
            }
        },
        handlePlay = () => {
            if (audioUrl) {
                setAudio(new Audio(audioUrl))
                if (audio) audio.play()
            }
        },
        handleStop = () => {
            if (isPlaying && audio) {
                audio.pause()
                audio.currentTime = 0
            }
        }

    useEffect(() => {
        //@ts-ignore
        const handleKeyDown = (event) => {
            if (event.key === ' ' && !isRecording) {
                handleRecord()
            }
        }, //@ts-ignore
        handleKeyUp = (event) => {
            if (event.key === ' ' && isRecording) {
                handleStopRecording()
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        document.addEventListener('keyup', handleKeyUp)
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            document.removeEventListener('keyup', handleKeyUp)
        }
    },[])

    return <Stack direction="row">
        {id ? <IconButton  onClick={() => {isPlaying ? handlePlay(): handleStop()}}> 
            {/* disabled={!audioUrl || !isRecording} */}
                {isPlaying ? <Stop/> : <PlayArrow/> }</IconButton>
            : <></>}
        <Stack direction='column'>
            <IconButton onMouseDown={handleRecord}
            onMouseUp={handleStopRecording}><RecordVoiceOver/></IconButton>
            {/* disabled={isRecording} */}
            <Typography>Hold Spacebar or click and hold to record</Typography>
        </Stack>
    </Stack>
}

export default RecordAudio