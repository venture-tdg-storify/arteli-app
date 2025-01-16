import type { Palette, ThemeOptions, PaletteMode } from '@mui/material/styles'

const lightColors = {
  divider: '#dfe1e5',
  primary: '#274ddb',
  secondary: '#4543ec',
  error: '#ad4249',
  warning: '#ff6d1b',
  info: '#0468cd',
  success: '#02a661',
  background: {
    default: '#ffffff',
    paper: '#ffffff',
    bar: '#f5f6f7',
    tab: '#ffffff',
    icon: '#F2F7FC',
    lightBlue: '#f7fafc',
    lightGreen: 'rgba(194, 255, 230, 0.5)'
  },
  text: {
    primary: '#060e17',
    secondary: '#444444',
    tertiary: '#748497',
    quaternary: '#636363'
  },
  white: '#ffffff',
  black: '#000000'
}

const darkColors = {
  divider: '#434345',
  primary: '#7f81f5',
  secondary: '#7386e7',
  error: '#ad4249',
  warning: '#ff6d1b',
  info: '#0468cd',
  success: '#02a661',
  background: {
    default: '#121212',
    paper: '#121212',
    bar: '#313131',
    tab: '#202020',
    icon: '#181819',
    lightBlue: '#313232',
    lightGreen: 'rgba(194, 255, 230, 0.25)'
  },
  text: {
    primary: '#ffffff',
    secondary: 'rgba(255, 255, 255, 0.7)',
    tertiary: 'rgba(255, 255, 255, 0.6)',
    quaternary: 'rgba(255, 255, 255, 0.5)'
  },
  white: '#ffffff',
  black: '#000000'
}

const getDesignTokens = (mode: PaletteMode) => {
  const colors = mode === 'light' ? lightColors : darkColors
  return {
    palette: {
      mode,
      divider: colors.divider,
      primary: { main: colors.primary },
      secondary: { main: colors.secondary },
      error: { main: colors.error },
      warning: { main: colors.warning },
      info: { main: colors.info },
      success: { main: colors.success },
      background: colors.background,
      text: colors.text
    },
    typography: {
      fontFamily: 'Inter, sans-serif',
      fontWeightBold: 600,
      h4: {
        fontSize: 36
      }
    },
    breakpoints: {
      values: { xs: 0, sm: 600, md: 1366, lg: 1728, xl: 1920 }
    },
    sizes: (() => {
      const headerHeight = 68
      const pageHeaderHeight = 117

      return {
        header: { height: headerHeight },
        drawer: { width: 540 },
        pageHeader: { height: pageHeaderHeight },
        page: { offset: headerHeight + pageHeaderHeight }
      }
    })(),
    components: {
      MuiDataGrid: {
        styleOverrides: {
          root: {
            borderColor: '#e0e0e0',
            '& .MuiDataGrid-filler': {
              background: colors.background.bar
            },
            '& .MuiDataGrid-scrollbarFiller--header': {
              background: colors.background.bar
            },
            '& .group-cell': {
              fontWeight: 600
            },
            '& .action-cell': {
              overflow: 'visible'
            },
            '& .column-status': {
              color: colors.error
            },
            '& .border-bottom': {
              borderBottom: '1px solid #e0e0e0',
              '& :not(:last-of-type)': {
                borderBottom: 'none'
              }
            },
            '& .border-top': {
              borderTop: '1px solid #e0e0e0',
              '& :not(:first-of-type)': {
                borderTop: 'none'
              }
            },
            '& .MuiDataGrid-columnHeader:last-child .MuiDataGrid-columnSeparator': {
              display: 'none'
            },
            '& .MuiDataGrid-row.Mui-selected': {
              backgroundColor: '#d2d2d2',
              ':hover': {
                backgroundColor: '#d2d2d2'
              }
            },
            '& .MuiDataGrid-columnHeaderTitle': {
              whiteSpace: 'normal !important'
            },
            '& .MuiDataGrid-columnHeaderTitleContainerContent': {
              width: '100%'
            }
          },
          columnHeader: {
            background: colors.background.bar,
            minHeight: 49,
            maxHeight: 'none !important',
            height: 'auto !important',
            ':focus-within, :focus': {
              outline: 'none'
            }
          },
          cell: {
            ':focus, :focus-within': {
              outline: 'none'
            }
          },
          columnSeparator: {
            color: colors.divider
          },
          row: {
            '--rowBorderColor': 'transparent',
            ':hover': {
              backgroundColor: 'transparent'
            }
          }
        }
      },
      MuiIcon: {
        defaultProps: {
          baseClassName: 'fal'
        },
        styleOverrides: {
          root: {
            fontSize: 16,
            overflow: 'visible'
          }
        }
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            fontSize: 14
          },
          head: {
            backgroundColor: '#F2F4FD'
          }
        }
      },
      MuiButtonBase: {
        defaultProps: {
          disableRipple: true
        }
      },
      MuiFab: {
        styleOverrides: {
          root: {
            boxShadow: 'none'
          }
        }
      },
      MuiTabs: {
        styleOverrides: {
          indicator: {
            top: 0,
            bottom: 'unset'
          }
        }
      },
      MuiTab: {
        styleOverrides: {
          root: {
            flex: 1,
            height: 40,
            backgroundColor: colors.background.bar,
            fontSize: 16,
            fontWeight: 600,
            textTransform: 'capitalize',
            color: colors.text.tertiary,
            '&.Mui-selected': {
              backgroundColor: colors.background.default,
              color: colors.secondary
            }
          }
        }
      },
      MuiButton: {
        styleOverrides: {
          root: {
            fontSize: 14,
            fontWeight: 600,
            display: 'inline-flex',
            justifyContent: 'center',
            alignItems: 'center',
            textTransform: 'capitalize'
          },
          outlinedSizeMedium: {
            padding: '11px 24px'
          },
          containedSizeMedium: {
            padding: '11px 24px'
          },
          containedPrimary: {
            backgroundColor: colors.primary,
            color: colors.white
          },
          containedSecondary: {
            border: `1px solid ${colors.primary}`,
            backgroundColor: colors.background.default,
            color: colors.primary
          },
          outlinedSuccess: {
            // border: `1px solid ${colors.success}`,
            color: colors.success
          },
          startIcon: {
            marginRight: 4
          }
        }
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            textarea: {
              border: `2px solid ${colors.divider}`,
              padding: 8,
              margin: '8px 0'
            },
            '& textarea::placeholder': {
              fontStyle: 'italic'
            }
          }
        }
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            '&.MuiInput-underline:before, &.MuiInput-underline:after': {
              display: 'none'
            }
          }
        }
      },
      MuiChip: {
        styleOverrides: {
          root: {
            height: 24,
            boxShadow: 'none',
            padding: '4px, 12px, 4px, 12px',
            borderRadius: 17,
            '& .MuiChip-icon': {
              marginLeft: 12
            }
          }
        }
      },
      MuiStack: {
        defaultProps: {
          direction: 'row',
          alignItems: 'center',
          justifyContent: 'space-between'
        }
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            backgroundColor: colors.white,
            padding: 0,
            alignItems: 'center',
            boxShadow: '2px 2px 5px 0px rgba(0, 0, 0, 0.20)'
          },
          icon: {
            fontSize: 16,
            padding: `12px 16px`,
            marginRight: 16,
            borderRadius: `4px 0 0 4px`
          },
          action: {
            padding: 0,
            marginRight: 8,
            marginLeft: 16,
            '.MuiSvgIcon-root': {
              fontSize: 16
            }
          },
          message: {
            color: colors.text.primary,
            textWrap: 'nowrap'
          },
          standardSuccess: {
            '.MuiAlert-icon': {
              backgroundColor: colors.success,
              color: colors.white
            }
          },
          standardError: {
            '.MuiAlert-icon': {
              backgroundColor: colors.error,
              color: colors.white
            }
          },
          standardInfo: {
            '.MuiAlert-icon': {
              backgroundColor: colors.info,
              color: colors.white
            }
          },
          standardWarning: {
            '.MuiAlert-icon': {
              backgroundColor: colors.warning,
              color: colors.white
            }
          }
        }
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            '&.Mui-selected': {
              backgroundColor: 'rgba(218, 248, 126, 0.40)'
            }
          }
        }
      }
    },
    shape: {
      borderRadius: 4
    }
  } as ThemeOptions
}

declare module '@mui/material/styles' {
  interface TypeBackground {
    bar: string
    icon: string
    lightBlue: string
    tab: string
    lightGreen: string
  }
  interface TypeText {
    tertiary: string
    quaternary: string
  }
  interface Theme {
    sizes: {
      drawer: {
        width: number
      }
      header: {
        height: number
      }
      pageHeader: {
        height: number
      }
      page: {
        offset: number
      }
    }
    palette: Palette & {
      background: {
        bar: string
        icon: string
        lightBlue: string
        tab: string
        lightGreen: string
      }
      text: {
        tertiary: string
        quaternary: string
      }
    }
  }

  // allow configuration using `createTheme`
  interface ThemeOptions {
    sizes?: {
      drawer: {
        width: number
      }
      header: {
        height: number
      }
      pageHeader: {
        height: number
      }
      page: {
        offset: number
      }
    }
  }
}

export default getDesignTokens
