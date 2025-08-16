import { createFileRoute } from '@tanstack/react-router'
import CardSet from "../../components/CardSet"

export const Route = createFileRoute('/cardset/create')({
  component: CreateCardset,
})

function CreateCardset() {
    return <CardSet/>
}
