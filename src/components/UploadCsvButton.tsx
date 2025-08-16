import {useRef} from "react"
import Papa from "papaparse"
import { IconButton } from "@mui/material"
import { FileOpen } from "@mui/icons-material"

const UploadCsvButton = ({setPhrases}:
        {setPhrases: React.Dispatch<React.SetStateAction<{
            sourcePhrase: string;
            targetPhrase: string;
        }[]>>}
    ) => {
    const fileInputRef = useRef(null),
        handleButtonClick = () => {
            //@ts-ignore
            fileInputRef.current.click()
        },
        //@ts-ignore fix this later
        handleFileChange = (event) => {
            const file = event.target.files[0]
            if (!file) return

            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                //@ts-ignore
                complete: (results) => {
                    console.log('Parsed CSV as object array:', results.data)
                },
                //@ts-ignore
                error: (err) => {
                    console.error('CSV parsing Error:', err)
                }
            })
        }
    
    return <>
        <IconButton onClick={handleButtonClick}><FileOpen/></IconButton>
        <input 
            type="file"
            accept=".csv"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}/>
    </>
}

export default UploadCsvButton
