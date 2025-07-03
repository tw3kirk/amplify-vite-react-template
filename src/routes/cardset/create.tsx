import { Button, Card, CardContent, CardHeader, Checkbox, Divider, FormControlLabel, Stack, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { generateClient } from "aws-amplify/data"
import type { Schema } from "../../../amplify/data/resource"
import { createFileRoute } from '@tanstack/react-router'
import { useAuthenticator } from "@aws-amplify/ui-react"

export const Route = createFileRoute('/cardset/create')({
  component: CreateCardset,
})

const client = generateClient<Schema>()

function deleteVocabList(id: string) {
    client.models.VocabList.delete({ id })
}

const initialVocabList = [{
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

function CreateCardset() {
    const [phrases, setPhrases] = useState(initialVocabList),
      { user } = useAuthenticator(),
      [name, setName] = useState(''),
      [description, setDescription] = useState(''),
      [isPublic, setIsPublic] = useState(true),
      [vocabLists, setVocabLists] = useState<Array<Schema["VocabList"]["type"]>>([]),
      addPhrase = () => {
        setPhrases([...phrases, {
          sourcePhrase: '',
          targetPhrase: ''
        }])
      },
      saveVocabSet = () => {
        client.models.VocabList.create({
          name: name,
          description: description,
          phrases: phrases,
          isPublic: isPublic,
          author: user?.signInDetails?.loginId ? user?.signInDetails?.loginId : 'unknown'
        })
      }

    useEffect(() => {
        client.models.VocabList.observeQuery().subscribe({
          next: (data) => setVocabLists([...data.items]),
        });
      }, []);

    return <Stack direction='column'>
    <TextField sx={{my: '1rem'}} label='Title' value={name} onChange={(e) => setName(e.target.value)}/>
    <TextField sx={{my: '1rem', mb: '2rem'}} label='Description' value={description} onChange={(e) => setDescription(e.target.value)}/>
    <FormControlLabel control={<Checkbox defaultChecked onChange={e => setIsPublic(e.target.checked)}/>} label="Public Card Set" />
    {phrases.map((phrase, i, phrases) => (
        <Card sx={{my: '1rem'}}>
            <CardHeader avatar={
                <Typography>{i+1}</Typography>
            }/>
            <Divider/>
            <CardContent>
                <Stack direction='row' sx={{justifyContent: 'space-between'}}>
                    <TextField label='Source Phrase' sx={{width: '25rem', mr: '1rem'}}
                    onChange={(e) => {
                        const workingPhrases = phrases
                        workingPhrases[i].sourcePhrase = e.target.value
                        setPhrases(workingPhrases)
                    }}/>
                    <TextField label='Target Phrase' sx={{width: '25rem', ml: '1rem'}}
                    onChange={(e) => {
                        const workingPhrases = phrases
                        workingPhrases[i].targetPhrase = e.target.value
                        setPhrases(workingPhrases)
                    }}/>
                </Stack>
            </CardContent>
        </Card>
    ))}
    <Button onClick={addPhrase} variant='contained'>Add Phrase</Button>
    <Button sx={{mt: '6em'}} onClick={saveVocabSet} variant='contained'>Create</Button>
  </Stack>
}
