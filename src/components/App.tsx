import { useEffect, useState } from "react";
import { Box, Button, Card, CardActions, CardContent, CardHeader, Chip, Dialog, Grid, Input, Stack, TextField, Typography } from "@mui/material";
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Link } from "@tanstack/react-router";
// import './index.css'



const client = generateClient<Schema>()


function App() {
  const { user, signOut } = useAuthenticator(),
      [vocabLists, setVocabLists] = useState<Array<Schema["VocabList"]["type"]>>([])



  // function createTodo() {
    
  //   //client.models.Todo.create({ content: window.prompt("Todo content") });
  // }

    useEffect(() => {
        client.models.VocabList.observeQuery().subscribe({
          next: (data) => setVocabLists([...data.items]),
        });
      }, []);

  return (
    <main>
      <h1>{user?.signInDetails?.loginId} vocab lists</h1>
      {/* <button onClick={() => setDialogOpen(true)}>+ new</button> */}
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
          {vocabLists.map((list) => (
              <Grid key={list?.id} size={{ xs: 2, sm: 4, md: 4 }}>
                <Card sx={{color: 'white'}}>
                  <Link to={`/cardset/${list.id}`}>
                    <CardHeader title={list?.name}/>
                    <CardContent>
                      <Chip label={`${list?.phrases?.length} cards`}/>
                    </CardContent>
                    <CardActions>
                      <Typography>{list?.author}</Typography>
                    </CardActions>
                  </Link>
                </Card>
              </Grid>
          ))}
        </Grid>
      </Box>
        {vocabLists.map((list) => (
          <li onClick={() => console.log(list)} key={list?.id}>{list?.name}</li>
        ))}
      {/* <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          Review next step of this tutorial.
        </a>
      </div> */}
      <button onClick={signOut}>Sign out</button>
    </main>
  );
}

export default App;
