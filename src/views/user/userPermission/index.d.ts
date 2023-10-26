export type TreeType = {
  children?: TreeType[]
  component?: () => void
  meta?: {
    select?: boolean
    level?: number
  }
  name?: string
  path?: string
  redirect?: string
}
