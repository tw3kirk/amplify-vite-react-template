
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { generateClient } from "aws-amplify/data"
import type { Schema } from "../../../amplify/data/resource"
import { Box, Button, Card, CardContent, Grid, Stack, Typography } from '@mui/material'
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver'
import HearingIcon from '@mui/icons-material/Hearing'
import StyleIcon from '@mui/icons-material/Style'
import TranslateIcon from '@mui/icons-material/Translate'
import CardSet from '../../components/CardSet'

export const Route = createFileRoute('/cardset/$setId')({
  component: ViewSet,
})

const client = generateClient<Schema>()

type GameButton = {
  label: string,
  icon: React.ReactNode,
  clickHandler: () => void
}

const practiceOptions: GameButton[] = [
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

export const GameButtons = ({item}: {item: GameButton}) => {
  return <>
    <Button onClick={item.clickHandler}>
      <Card>
        <CardContent>
          <Typography>{item.label}</Typography>
          {item.icon}
        </CardContent>
      </Card>
    </Button>
  </>
}

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
          { vocabList ? <CardSet origVocabSet={vocabList}/>
          : <Typography>This Vocab List Does not exist</Typography>}
          {/* something like this later for multiple games */}
          {/* <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            {practiceOptions.map((item) => (
              <Grid key={item.label} size={{ xs: 2, sm: 4, md: 4 }}>
                <GameButton item={item}/>
              </Grid>
            ))}
          </Grid> */}
      </Box>}
    </>
}