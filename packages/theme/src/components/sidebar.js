import {Box} from '@primer/components'
import React from 'react'
import {useStaticQuery, graphql} from 'gatsby'
import {HEADER_HEIGHT} from './header'
import NavItems from './nav-items'

function usePersistentScroll(id) {
  const ref = React.useRef()

  const handleScroll = React.useCallback(
    // Save scroll position in session storage on every scroll change
    event => window.sessionStorage.setItem(id, event.target.scrollTop),
    [id],
  )

  React.useEffect(() => {
    // Restore scroll position when component mounts
    const scrollPosition = window.sessionStorage.getItem(id)
    if (scrollPosition && ref.current) {
      ref.current.scrollTop = scrollPosition
    }
  }, [])

  // Return props to spread onto the scroll container
  return {
    ref,
    onScroll: handleScroll,
  }
}

function Sidebar() {
  const scrollContainerProps = usePersistentScroll('sidebar')
  const data = useStaticQuery(graphql`
    {
      allSummaryGroup {
        nodes {
          title
          items {
            title
            url
            external
            items {
              title
              url
              external
              items {
                title
                url
                external
                items {
                  title
                  url
                  external
                }
              }
            }
          }
        }
      }
    }
  `)

  if (data.allSummaryGroup.nodes && data.allSummaryGroup.nodes.length <= 0) {
    return null
  }
  return (
    <Box
      display={['none', null, null, 'block']}
      position="sticky"
      top={HEADER_HEIGHT}
      height={`calc(100vh - ${HEADER_HEIGHT}px)`}
      minWidth={260}
      color="auto.gray.8"
      bg="auto.gray.0"
    >
      <Box
        borderStyle="solid"
        borderColor="border.primary"
        {...scrollContainerProps}
        borderWidth={0}
        borderRightWidth={1}
        borderRadius={0}
        height="100%"
        style={{overflow: 'auto'}}
      >
        <Box display="flex" flexDirection="column">
          <NavItems items={data.allSummaryGroup.nodes} />
        </Box>
      </Box>
    </Box>
  )
}

export default Sidebar