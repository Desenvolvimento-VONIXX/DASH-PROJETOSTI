import { createFileRoute } from '@tanstack/react-router'
import { Projetos } from '@/pages/Projetos'

export const Route = createFileRoute('/')({
  component: Projetos,
})
