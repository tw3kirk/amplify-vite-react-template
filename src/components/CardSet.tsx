import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Card, CardContent, CardHeader, Checkbox, Divider, FormControlLabel, IconButton, Stack, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { generateClient } from "aws-amplify/data"
import type { Schema } from "../../amplify/data/resource"
import { useAuthenticator } from "@aws-amplify/ui-react"
import { ArrowDropDown, Cancel, Edit, PlayArrow, RecordVoiceOver, Stop } from "@mui/icons-material"
import UploadCsvButton from "./UploadCsvButton"
import RecordAudio from "./RecordAudio"
import RecordAudioBetter from "./RecordAudioBetter"

const client = generateClient<Schema>()

function deleteVocabList(id: string) {
    client.models.VocabList.delete({ id })
}

const initialVocabList: Schema["Phrase"]["type"][] = [{
    sourcePhrase: '',
    targetPhrase: ''
},{
    sourcePhrase: '',
    targetPhrase: ''
},{
    sourcePhrase: '',
    targetPhrase: ''
},{
    sourcePhrase: '',
    targetPhrase: ''
},{
    sourcePhrase: '',
    targetPhrase: ''
},{
    sourcePhrase: '',
    targetPhrase: ''
}]

const CardSet = ({origVocabSet}: {origVocabSet?: Schema["VocabList"]["type"]}) => {
    const [phrases, setPhrases] = useState(initialVocabList),
      { user } = useAuthenticator(),
      [name, setName] = useState(origVocabSet?.name ?? ''),
      [id, setId] = useState(origVocabSet?.id ?? ''),
      [description, setDescription] = useState(origVocabSet?.description),
      [editMode, setEditMode] = useState(!id),
      [isPublic, setIsPublic] = useState(true),
      [targetSelected, setTargetSelected] = useState(true),
      [selectedPhrase, setSelectedPhrase] = useState<undefined|number>(),
      addPhrase = () => {
        setPhrases([...phrases, {
          sourcePhrase: '',
          targetPhrase: ''
        }])
      },
      saveVocabSet = () => {
        if (id) {
          client.models.VocabList.update({
            id: id,
            name: name,
            description: description,
            phrases: phrases,
            isPublic: isPublic,
            author: user?.signInDetails?.loginId ? user?.signInDetails?.loginId : 'unknown'
          })
        } else {
          client.models.VocabList.create({
            name: name,
            description: description,
            phrases: phrases,
            isPublic: isPublic,
            author: user?.signInDetails?.loginId ? user?.signInDetails?.loginId : 'unknown'
          }).then(res => {
            res.data?.id && setId(res.data?.id)
          })

          //redirect to view set page
        }
        setEditMode(false)
      }

    return <Stack direction='column'>
      <Button sx={{mt: '6em', ml: 'auto'}} onClick={saveVocabSet} variant='contained'>{id ? 'Save' : 'Create'}</Button>
      {!!id && <IconButton sx={{mt: '1em', ml: 'auto'}} onClick={() => setEditMode(!editMode)}>{editMode? <Cancel/> : <Edit/>}</IconButton>}
      {editMode ? <TextField sx={{my: '1rem'}} label='Title' value={name} onChange={(e) => setName(e.target.value)}/>
        : <Typography variant='h2'>{name}</Typography>}
      {editMode ? <TextField sx={{my: '1rem', mb: '2rem'}} label='Description' value={description} onChange={(e) => setDescription(e.target.value)}/>
        : <Typography variant='h2'>{name}</Typography>}
      {editMode ? <FormControlLabel control={<Checkbox defaultChecked onChange={e => setIsPublic(e.target.checked)}/>} label="Public Card Set" />
        : <Typography>{isPublic ? 'Public Set': 'Private Set'}</Typography>}
      {!editMode && <>
          <Typography variant='caption'>Created by</Typography>
          <Typography variant='body1'>{origVocabSet?.author}</Typography>
          <Typography variant='body1'>created {origVocabSet?.createdDate}</Typography>
        </>}
      {editMode && <Box sx={{mx: 'auto'}}><UploadCsvButton setPhrases={setPhrases}/></Box>}
      {phrases.map((phrase, i, phrases) => (
          <Card sx={{my: '1rem'}}>
              <CardHeader avatar={
                  <Typography>{i+1}</Typography>
              }/>
              <Divider/>
              <CardContent>
                  <Stack direction='row' sx={{justifyContent: 'space-between'}}>
                      {editMode ? <TextField label='Source Phrase' sx={{width: '25rem', mr: '1rem'}}
                        onChange={(e) => {
                            const workingPhrases = phrases
                            workingPhrases[i].sourcePhrase = e.target.value
                            setPhrases(workingPhrases)
                        }}/>
                      : <Typography>{phrase.sourcePhrase}</Typography>}
                      {editMode ? <TextField label='Target Phrase' sx={{width: '25rem', ml: '1rem'}}
                      onChange={(e) => {
                          const workingPhrases = phrases
                          workingPhrases[i].targetPhrase = e.target.value
                          setPhrases(workingPhrases)
                      }}/>
                      : <Typography>{phrase.sourcePhrase}</Typography>}
                  </Stack>
                  {editMode && <Accordion expanded={i === selectedPhrase} onChange={(_, val) => setSelectedPhrase(val ? i : undefined)}>
                    <AccordionSummary expandIcon={<ArrowDropDown/>}/>
                    <AccordionDetails>
                      <Stack direction="row" sx={{justifyContent: 'space-between'}}>
                        {targetSelected ? <Button>Show Source Audio</Button>
                        : <RecordAudio id={phrase?.sourceId ?? ''}/>}
                        {targetSelected ? <RecordAudioBetter/> //<RecordAudio id={phrase?.targetId ?? ''}/>
                        : <Button>Show Target Audio</Button>}
                      </Stack>
                    </AccordionDetails>
                  </Accordion>}
              </CardContent>
          </Card>
      ))}
      {editMode && <Button onClick={addPhrase} variant='contained'>Add Phrase</Button>}
  </Stack>
}

export default CardSet
