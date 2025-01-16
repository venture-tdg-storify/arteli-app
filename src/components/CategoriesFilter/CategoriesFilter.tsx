import type { Category, Subcategory } from '@/api/arteli'
import type { AutocompleteChangeDetails, AutocompleteChangeReason, AutocompleteValue } from '@mui/material/Autocomplete'
import type { FilterOptionsState } from '@mui/material/useAutocomplete'
import type { MessageDescriptor } from 'react-intl'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { groupById } from '@arteli/utils'
import Autocomplete from '@mui/material/Autocomplete'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import Icon from '@mui/material/Icon'
import IconButton from '@mui/material/IconButton'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import { defineMessages, useIntl } from 'react-intl'
import { useAllRelevantSubcategories, useAllRelevantCategories } from '@/hooks/arteli'

const GroupItems = styled('ul')({
  padding: 0,
  // paddingLeft: 2,
  display: 'flex',
  justifyContent: 'flex-start',
  flexDirection: 'row',
  flexWrap: 'wrap',
  margin: 0
})

const isSubcategoryOption = (option: Option) => option.subcategory !== null
const isCategoryOption = (option: Option) => option.subcategory === null

type Option = { category: Category; subcategory: Subcategory | null }

const messages = defineMessages({
  warning: {
    id: '4RlVPX',
    defaultMessage:
      'Actions will be disabled when multiple subcategories are selected. Please select either an entire category or a single subcategory to proceed.'
  },
  error: {
    id: 'lkhPMZ',
    defaultMessage: 'Please select a category to see available recommendations'
  },
  filterBy: { id: 'M0nGyl', defaultMessage: 'Filter by category or subcategory name' },
  inputLabel: { id: 'fq2zb6', defaultMessage: 'Category Filter' }
})

export function CategoryFilters({
  categoryId,
  subcategoryIds,
  onChange,
  fullWidth = false,
  showErrors = true,
  inputLabel = messages.inputLabel
}: {
  categoryId: Category['id']
  subcategoryIds: Subcategory['id'][]
  onChange: (_: { categoryId: Category['id'] | null; subcategoryIds: Subcategory['id'][] }) => void
  fullWidth?: boolean
  showErrors?: boolean
  inputLabel?: MessageDescriptor
}) {
  const { data: categories } = useAllRelevantCategories()
  const { data: subcategories } = useAllRelevantSubcategories()
  const { formatMessage: t } = useIntl()

  const categoriesById = useMemo(() => (categories ? groupById(categories) : {}), [categories])

  const options = useMemo<Option[]>(
    () =>
      (
        (subcategories ?? [])
          .filter((_) => _.isInActiveRecSet)
          .flatMap((subcategory) =>
            subcategory.categoryIds.map((categoryId) => ({ subcategory, category: categoriesById[categoryId] }))
          ) as Option[]
      )
        .concat(
          (categories ?? []).filter((_) => _.isInActiveRecSet).map((category) => ({ category, subcategory: null }))
        )
        .sort(
          ({ category: a, subcategory: aa }, { category: b, subcategory: bb }) =>
            (a?.name ?? '').localeCompare(b?.name ?? '') || (aa?.externalId ?? '').localeCompare(bb?.externalId ?? '')
        ),
    [categories, categoriesById, subcategories]
  )
  const [value, setValue] = useState<Option[]>([])

  useEffect(() => {
    setValue(
      options.filter((_) => {
        if (!_.category) console.log(_, 'ovaj')
        return (
          _.category.id === categoryId &&
          (!_.subcategory || (_.subcategory && subcategoryIds.includes(_.subcategory.id)))
        )
      })
    )
  }, [categoryId, options, subcategoryIds])

  const getOptionsInCategory = useCallback(
    (categoryId: string): { category: Category; subcategory: Subcategory }[] =>
      options.filter(({ category, subcategory }) => !!subcategory && category.id === categoryId) as {
        category: Category
        subcategory: Subcategory
      }[],
    [options]
  )

  const [open, setOpen] = useState<Record<Category['id'], boolean>>({})

  const { selectedCategory, selectedSubcategories, allSubcategoriesSelected } = useMemo(() => {
    const selectedCategory = value.find(isSubcategoryOption)?.category
    const selectedSubcategories = value.filter(isSubcategoryOption).map(({ subcategory }) => subcategory!)
    const categoryOptions = selectedCategory ? getOptionsInCategory(selectedCategory.id) : []

    return {
      selectedCategory,
      selectedSubcategories,
      allSubcategoriesSelected: !!selectedCategory && categoryOptions.length === selectedSubcategories.length
    }
  }, [getOptionsInCategory, value])

  const warning = selectedSubcategories.length > 1 && !allSubcategoriesSelected
  const error = value.length === 0

  const handleChange = useCallback(
    (
      _: React.SyntheticEvent,
      newValue: AutocompleteValue<Option, true, true, false>,
      reason: AutocompleteChangeReason,
      details?: AutocompleteChangeDetails<Option>
    ) => {
      const { option } = details as { option: Option }

      const optionType = option?.subcategory ? 'subcategory' : 'category'

      if ('category' === optionType) {
        if (reason === 'removeOption') {
          setValue([])
          return
        }

        if (reason === 'selectOption') {
          setOpen({
            ...open,
            [option.category.id]: true,
            ...(selectedCategory ? { [selectedCategory.id]: false } : null)
          })

          setValue([option, ...getOptionsInCategory(option.category.id)])
          return
        }
      }

      if ('subcategory' === optionType) {
        if (reason === 'removeOption') {
          if (newValue.length === 1) {
            // last subcategory
            setValue([])
            return
          }
        }

        if (reason === 'selectOption') {
          const anotherCategory = new Set(newValue.map((_) => _.category.id)).size > 1

          if (anotherCategory) {
            setValue([options.filter(isCategoryOption).find((_) => _.category.id === option.category.id)!, option])

            if (selectedCategory) {
              setOpen({ ...open, [selectedCategory?.id]: false })
            }

            return
          }

          const allSelected =
            getOptionsInCategory(option.category.id).length === newValue.filter(isSubcategoryOption).length

          if (allSelected) {
            setValue([
              options.find((_) => _.category.id === option.category.id && _.subcategory === null)!,
              ...newValue
            ])
            return
          }
        }
      }

      setValue(newValue)
    },
    [getOptionsInCategory, open, options, selectedCategory]
  )

  const handleCLose = useCallback(() => {
    onChange({ categoryId: selectedCategory?.id ?? null, subcategoryIds: selectedSubcategories.map((_) => _.id) }) // TODO: null -> not null
  }, [onChange, selectedCategory?.id, selectedSubcategories])

  const filterOptions = useCallback((options: Option[], { inputValue }: FilterOptionsState<Option>): Option[] => {
    inputValue = inputValue.trim()

    if (!inputValue) return options

    const query = inputValue.toLowerCase()

    return options.filter(({ subcategory, category }) => {
      return (
        subcategory?.externalId?.toLowerCase().includes(query) || category.externalId?.toLowerCase().includes(query)
      )
    })
  }, [])

  return (
    <Autocomplete
      openOnFocus
      multiple
      limitTags={4}
      size="small"
      options={options}
      disableCloseOnSelect
      disableClearable
      groupBy={({ category }) => category.id}
      onClose={handleCLose}
      onChange={handleChange}
      filterOptions={filterOptions}
      renderGroup={({ children, key }) => <GroupItems key={key}>{children}</GroupItems>}
      value={value}
      getOptionLabel={({ subcategory, category }) =>
        subcategory
          ? (subcategory.externalId ?? subcategory.id)
          : `${category.name} (${category.externalId ?? category.id})`
      }
      renderOption={({ key, ...props }, { subcategory, category }, { selected }) => {
        const isOpen = open[category.id] ?? false

        if (subcategory) {
          if (!isOpen) return null

          return (
            <ListItem
              {...props}
              key={`${category.id}-${subcategory?.id}`}
              sx={{ display: 'none' }}
              secondaryAction={<Checkbox checked={selected} />}
            >
              <ListItemText
                primaryTypographyProps={{
                  style: { textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', fontWeight: 'normal' }
                }}
                sx={{ ml: 5.25 }}
                // primary={`${category.externalId} / ${subcategory.externalId}`}
                primary={subcategory.externalId}
              />
            </ListItem>
          )
        }

        const $categoryId = category.id
        const $category = category

        return (
          <ListItem
            key={key}
            {...props}
            disablePadding
            sx={{ position: 'sticky', fontWeight: 'bold' }}
            secondaryAction={<Checkbox indeterminate={selected && !allSubcategoriesSelected} checked={selected} />}
          >
            <IconButton
              sx={{ ml: -1, mr: 1 }}
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                setOpen({ ...open, [$categoryId]: !open[$categoryId] })
              }}
            >
              <Icon className={isOpen ? 'fa-chevron-up' : 'fa-chevron-down'} sx={{ fontSize: 20 }} />
            </IconButton>
            <ListItemText
              primaryTypographyProps={{
                style: { textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', fontWeight: 'bold' }
              }}
              primary={$category?.externalId ?? ''}
            />
          </ListItem>
        )
      }}
      style={{ width: fullWidth ? '100%' : '50%', maxWidth: fullWidth ? 'unset' : 600 }}
      renderInput={(params) => (
        <TextField
          label={t(inputLabel)}
          {...params}
          placeholder={t(messages.filterBy)}
          {...(warning ? { helperText: t(messages.warning), color: 'warning', focused: true } : undefined)}
          {...(error && showErrors ? { helperText: t(messages.error), focused: true, error: true } : undefined)}
          sx={{ marginBottom: warning ? 1 : 3 }}
        />
      )}
      renderTags={(tagValue, getTagProps) => {
        const categoryOption = tagValue.find((_) => _.subcategory === null)!

        if (!categoryOption) return null

        if (allSubcategoriesSelected) {
          return [categoryOption].map(({ category }, index) => (
            <Chip
              {...getTagProps({ index })}
              label={category.name + '(' + category.externalId + ')'}
              key={category.id}
              onDelete={undefined}
            />
          ))
        }

        const chips = tagValue.filter((_) => _.subcategory !== null)

        return chips.map(({ category, subcategory }, index) => (
          <Chip
            {...getTagProps({ index })}
            key={category.id + ' ' + subcategory?.id}
            label={`${category.externalId} / ${subcategory?.externalId}`}
            onDelete={undefined}
          />
        ))
      }}
    />
  )
}
