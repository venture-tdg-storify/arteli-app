import { useMemo } from 'react'
import { useVisibleTags } from './useVisibleTags'

export const useTagList = ({ tags }: { tags?: number }) => {
  const { visibleTags } = useVisibleTags()

  const tagsList = useMemo(
    () =>
      tags
        ? visibleTags.filter(({ value }) => tags & value).map(({ name }) => (name === 'Disco' ? 'Discontinued' : name))
        : [],
    [tags, visibleTags]
  )

  return { tagsList }
}
