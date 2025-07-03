
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { generateClient } from "aws-amplify/data"
import type { Schema } from "../../../amplify/data/resource"
import { Box, Button, Card, CardContent, Grid, Stack, Typography } from '@mui/material'
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver'
import HearingIcon from '@mui/icons-material/Hearing'
import StyleIcon from '@mui/icons-material/Style'
import TranslateIcon from '@mui/icons-material/Translate'

export const Route = createFileRoute('/cardset/$setId')({
  component: ViewSet,
})

const client = generateClient<Schema>()



const practiceOptions = [
  {
    label: 'Speak',
    icon: <RecordVoiceOverIcon/>,
    clickHandler: () => console.log('navigate to speaking')
  },
  {
    label: 'Listen',
    icon: <HearingIcon/>,
    clickHandler: () => console.log('navigate to listening')
  },
  {
    label: 'Flash Cards',
    icon: <StyleIcon/>,
    clickHandler: () => console.log('navigate to flash cards')
  },
  {
    label: 'Write',
    icon: <TranslateIcon/>,
    clickHandler: () => console.log('navigate to writing practice')
  }
]

function ViewSet() {
    const { setId } = Route.useParams(),
      [vocabList, setVocabList] = useState<Schema["VocabList"]["type"]|null>()

    useEffect(() => {
      client.models.VocabList.get({id: setId}).then((res) => 
        setVocabList(res.data))
    }, []);

    return <>
      {vocabList === null
      ? <Typography>Vocab List Not Found</Typography>
      : <Box>
        <Stack>
          <Typography variant='h2'>{vocabList?.name}</Typography>
          <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            {practiceOptions.map((item) => (
              <Grid key={item.label} size={{ xs: 2, sm: 4, md: 4 }}>
                <Button onClick={item.clickHandler}>
                  <Card>
                    <CardContent>
                      <Typography>{item.label}</Typography>
                      {item.icon}
                    </CardContent>
                  </Card>
                </Button>
              </Grid>
            ))}
          </Grid>
          <Typography variant='caption'>Created by</Typography>
          <Typography variant='body1'>{vocabList?.author}</Typography>
          <Typography variant='body1'>created {vocabList?.createdDate}</Typography>
          {vocabList?.phrases?.map(phrase => {
            return <Typography>{phrase?.sourcePhrase} {phrase?.targetPhrase}</Typography>
          })}
        </Stack>
      </Box>}
    </>
}