import { useStaticQuery, graphql } from "gatsby";

function useThemeConfig() {
  const data = useStaticQuery(graphql`
    {
      primerWikiThemeConfig(id: { eq: "gatsby-theme-primer-wiki-config" }) {
        shouldShowLastUpdated
        lastUpdatedText
        sidebarDepth
        editUrlText
        shouldShowSidebarListOnIndex
        nav {
          title
          url
          items {
            title
            url
          }
        }
      }
    }
  `);
  return data.primerWikiThemeConfig;
}

export default useThemeConfig;
